// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "CarlApp",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(name: "CarlApp", targets: ["CarlApp"])
    ],
    targets: [
        .target(
            name: "CarlApp",
            path: "Sources/CarlApp"
        )
    ]
)
