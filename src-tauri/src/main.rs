// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    tray::TrayIconBuilder,
};
use tauri::Manager;
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
async fn close_splashscreen(window: tauri::WebviewWindow) {
    window
        .get_webview_window("splashscreen")
        .expect("no window labeled 'splashscreen' found")
        .close()
        .unwrap();
    window
        .get_webview_window("main")
        .expect("no window labeled 'main' found")
        .show()
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let icon = app.default_window_icon().cloned().unwrap();

            let menu = MenuBuilder::new(app)
                .item(&MenuItemBuilder::with_id("checkforupdates", "Check for updates").build(app)?)
                .item(&PredefinedMenuItem::separator(app)?)
                .item(&MenuItemBuilder::with_id("help", "Help").build(app)?)
                .item(&PredefinedMenuItem::separator(app)?)
                .item(&MenuItemBuilder::with_id("quit", "Quit").build(app)?)
                .build()?;

            let _tray = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("Amica")
                .on_menu_event(|app, event| {
                    match event.id().as_ref() {
                        "quit" => {
                            std::process::exit(0);
                        }
                        "checkforupdates" => {
                            let url = "https://github.com/semperai/amica/releases/latest";
                            app.opener().open_url(url, None::<&str>).expect("failed to open url");
                        }
                        "help" => {
                            let url = "https://docs.heyamica.com";
                            app.opener().open_url(url, None::<&str>).expect("failed to open url");
                        }
                        _ => {}
                    }
                })
                .build(app)?;

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![close_splashscreen])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
