// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::tray::{MouseButton, MouseButtonState, TrayIconEvent};
use tauri::Manager;
use tauri::{
    menu::MenuBuilder ,
    tray::TrayIconBuilder,
    WebviewWindowBuilder,
};
use tauri_plugin_opener::OpenerExt;

#[tauri::command]
async fn close_splashscreen(window: tauri::WebviewWindow) {
    if let Some(splash) = window.get_webview_window("splashscreen") {
        let _ = splash.close();
    }
    if let Some(main) = window.get_webview_window("main") {
        let _ = main.show();
    }
}

#[tauri::command]
async fn create_pet_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(pet) = app.get_webview_window("pet") {
        let _ = pet.show();
        let _ = pet.set_focus();
        return Ok(());
    }

    WebviewWindowBuilder::new(&app, "pet", tauri::WebviewUrl::App("/pet".into()))
        .title("Amica Pet")
        .inner_size(400.0, 600.0)
        .decorations(false)
        .transparent(true)
        .shadow(false)
        .always_on_top(true)
        .skip_taskbar(true)
        .resizable(true)
        .visible(true)
        .build()
        .map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
async fn close_pet_window(app: tauri::AppHandle) -> Result<(), String> {
    if let Some(pet) = app.get_webview_window("pet") {
        let _ = pet.close();
    }
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let icon = app.default_window_icon().cloned().unwrap();

            let menu = MenuBuilder::new(app)
                .text("show", "Show")
                .separator()
                .text("checkforupdates", "Check for updates")
                .separator()
                .text("help", "Help")
                .separator()
                .text("quit", "Quit")
                .build()?;

            let main_window = app.get_webview_window("main").unwrap();
            let main_for_tray = main_window.clone();
            let main_for_close = main_window.clone();

            // Tray: left-click → show main, right-click → menu
            let _ = TrayIconBuilder::new()
                .icon(icon)
                .menu(&menu)
                .tooltip("Amica")
                .show_menu_on_left_click(false)
                .on_tray_icon_event(move |_tray, event| {
                    match event {
                        // 监听左键抬起事件（相当于一次完整的单击）
                        TrayIconEvent::Click {
                            button: MouseButton::Left,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            println!("托盘左键被点击");

                            let _ = main_for_tray.show();
                            let _ = main_for_tray.set_focus();
                        }

                        // 监听右键抬起事件
                        TrayIconEvent::Click {
                            button: MouseButton::Right,
                            button_state: MouseButtonState::Up,
                            ..
                        } => {
                            println!("托盘右键被点击");

                            // 注意：如果你使用了 `.menu(&your_menu)` 绑定了菜单，
                            // 右键抬起时操作系统会自动接管并弹出菜单。
                            // 但你依然可以在这里执行一些额外的逻辑，例如日志记录等。
                        }

                        // 可选：监听双击等其他事件
                        TrayIconEvent::DoubleClick {
                            button: MouseButton::Left,
                            ..
                        } => {
                            println!("托盘左键被双击");
                        }

                        _ => {} // 忽略其他未匹配事件
                    }
                })
                .on_menu_event(|app, event| match event.id().as_ref() {
                    "quit" => {
                        std::process::exit(0);
                    }
                    "checkforupdates" => {
                        let url = "https://github.com/semperai/amica/releases/latest";
                        app.opener()
                            .open_url(url, None::<&str>)
                            .expect("failed to open url");
                    }
                    "help" => {
                        let url = "https://docs.heyamica.com";
                        app.opener()
                            .open_url(url, None::<&str>)
                            .expect("failed to open url");
                    }
                    "show" => {
                        if let Some(main) = app.get_webview_window("main") {
                            let _ = main.show();
                            let _ = main.set_focus();
                        }
                    }
                    _ => {}
                })
                .build(app)?;

            // X button → hide instead of close (so tray can bring it back)
            main_window.on_window_event(move |event| {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = main_for_close.hide();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            close_splashscreen,
            create_pet_window,
            close_pet_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
