import Foundation

struct CarlUserIdentity {
    static let key = "carl.user.id"

    static func loadOrCreate(defaults: UserDefaults = .standard) -> String {
        if let existing = defaults.string(forKey: key), !existing.isEmpty {
            return existing
        }
        let id = UUID().uuidString.lowercased()
        defaults.set(id, forKey: key)
        return id
    }
}
