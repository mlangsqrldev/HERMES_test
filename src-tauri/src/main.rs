// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Serialize;
use sha2::{Digest, Sha256};
use std::collections::HashMap;
use std::path::Path;
use tauri::Emitter;
use tauri::Window;
use tokio::fs::File;
use tokio::io::AsyncReadExt;
use walkdir::WalkDir;

// 2. Your struct for progress tracking
#[derive(Clone, Serialize)]
struct ProgressPayload {
    filename: String,
    bytes_processed: u64,
    total_bytes: u64,
}

// 3. Your async commands and helper functions
#[tauri::command]
async fn generate_bag_hashes(
    window: Window,
    base_dir: String,
) -> Result<HashMap<String, String>, String> {
    let mut file_hashes = HashMap::new();

    // Iterate through all files and folders in the base_dir recursively
    for entry in WalkDir::new(&base_dir).into_iter().filter_map(|e| e.ok()) {
        let path = entry.path();

        // We only want to hash files, skip directories
        if path.is_file() {
            let absolute_path_str = path.to_string_lossy().to_string();

            // Calculate the relative path for the BagIt manifest
            // e.g., turning "C:/Users/name/folder/data/XYZ.obj" into "data/XYZ.obj"
            let relative_path = path
                .strip_prefix(&base_dir)
                .unwrap_or(path) // fallback to absolute if stripping fails
                .to_string_lossy()
                .replace("\\", "/"); // BagIt manifests usually prefer forward slashes

            // Call your existing hash function
            match hash_file_with_progress(&window, &absolute_path_str).await {
                Ok(hash) => {
                    // Insert into our map: { "data/hp/XYZ.obj" : "a1b2c3d4..." }
                    file_hashes.insert(relative_path, hash);
                }
                Err(e) => {
                    // If a single file fails (e.g. permission denied), return the error
                    return Err(format!("Failed to hash file {}: {}", relative_path, e));
                }
            }
        }
    }

    // Return the completed map to the Vue frontend
    Ok(file_hashes)
}

async fn hash_file_with_progress(window: &Window, path: &str) -> Result<String, std::io::Error> {
    let mut file = File::open(path).await?;
    let total_bytes = file.metadata().await?.len();

    let mut hasher = Sha256::new();
    let mut buffer = vec![0; 4 * 1024 * 1024];
    let mut bytes_processed: u64 = 0;

    let filename = Path::new(path)
        .file_name()
        .unwrap()
        .to_string_lossy()
        .to_string();

    loop {
        let bytes_read = file.read(&mut buffer).await?;
        if bytes_read == 0 {
            break;
        }

        hasher.update(&buffer[..bytes_read]);
        bytes_processed += bytes_read as u64;

        let _ = window.emit(
            "hash-progress",
            ProgressPayload {
                filename: filename.clone(),
                bytes_processed,
                total_bytes,
            },
        );
    }

    let hash_result = hasher.finalize();
    Ok(format!("{:x}", hash_result))
}
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        // YOU MUST REGISTER THE COMMAND HERE:
        .invoke_handler(tauri::generate_handler![generate_bag_hashes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    hermes_lib::run()
}
