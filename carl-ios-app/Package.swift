// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "CarlApp",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .executable(name: "CarlApp", targets: ["CarlApp"])
    ],
    targets: [
        .executableTarget(
            name: "CarlApp",
            path: "Sources/CarlApp"
        )
    ]
)
