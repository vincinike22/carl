import SwiftUI

enum CarlTab: Hashable {
    case conversation
    case journal
    case journey
    case reflection
}

enum MemoryAccessMode: String, CaseIterable, Identifiable {
    case allShared = "All shared entries"
    case selectedOnly = "Only selected entries"
    case attachedOnly = "Attached entries only"

    var id: String { rawValue }

    var description: String {
        switch self {
        case .allShared:
            return "Carl can draw from everything you have explicitly shared."
        case .selectedOnly:
            return "Carl only sees the entries you choose to make available."
        case .attachedOnly:
            return "Carl only sees what you attach to a given conversation."
        }
    }
}

enum JournalAccess: String, CaseIterable {
    case shared
    case privateOnly
    case attached

    var title: String {
        switch self {
        case .shared: return "Shared with Carl"
        case .privateOnly: return "Private"
        case .attached: return "Attached"
        }
    }

    var tint: Color {
        switch self {
        case .shared: return CarlPalette.sage
        case .privateOnly: return CarlPalette.sand
        case .attached: return CarlPalette.lavender
        }
    }

    var systemImage: String {
        switch self {
        case .shared: return "circle.fill"
        case .privateOnly: return "lock.fill"
        case .attached: return "paperclip"
        }
    }
}

enum MessageAuthor {
    case user
    case carl
}

struct ConversationMessage: Identifiable {
    let id = UUID()
    let author: MessageAuthor
    let text: String
}

struct JournalEntry: Identifiable {
    let id = UUID()
    let date: String
    let title: String
    let preview: String
    var access: JournalAccess
}

struct MemoryItem: Identifiable {
    let id = UUID()
    let date: String
    let kind: String
    let title: String
    let body: String
    let tint: Color
    let source: String
}

struct ReflectionSection: Identifiable {
    let id = UUID()
    let title: String
    let body: String
    let tint: Color
}

struct SuggestedMemory {
    var text: String
    var isVisible: Bool
}
