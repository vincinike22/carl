import SwiftUI

enum CarlTab: Hashable {
    case conversation
    case journal
    case journey
    case reflection
}

enum CarlInfoTopic: String, Identifiable {
    case conversation
    case journal
    case journey
    case reflection

    var id: String { rawValue }

    var title: String {
        switch self {
        case .conversation: return "Conversation"
        case .journal: return "Journal"
        case .journey: return "Journey"
        case .reflection: return "Reflection"
        }
    }

    var bodyText: String {
        switch self {
        case .conversation:
            return "Conversation is the main chamber. Start quickly, then let meaning emerge. Shared context and attached entries help Carl respond with more depth."
        case .journal:
            return "Journal is yours first. Private stays private. Shared with Carl becomes available as context. Attached means you bring it into a specific exchange on purpose."
        case .journey:
            return "Journey keeps memory inspectable. You can see what came from you, what Carl noticed, and what later became reflection."
        case .reflection:
            return "Reflection letters are slower syntheses. They collect themes, shifts, and questions that deserve a calmer form than chat."
        }
    }
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

enum JournalMode: String, CaseIterable, Identifiable {
    case privateMode = "Private"
    case sharedWithCarl = "Shared with Carl"
    case attached = "Attached"

    var id: String { rawValue }

    var tint: Color {
        switch self {
        case .privateMode: return CarlPalette.sand
        case .sharedWithCarl: return CarlPalette.sage
        case .attached: return CarlPalette.lavender
        }
    }
}

enum JourneyFilter: String, CaseIterable, Identifiable {
    case all = "All"
    case journal = "Journal"
    case carlNotes = "Carl notes"
    case reflections = "Reflections"

    var id: String { rawValue }
}

enum ReflectionRange: String, CaseIterable, Identifiable {
    case last7Days = "Last 7 days"
    case last30Days = "Last 30 days"
    case sinceMarch1 = "Since March 1"
    case customRange = "Custom range"

    var id: String { rawValue }
}

enum ConversationAuthor: String, Codable {
    case user
    case carl
}

enum JourneyAccent: String, Codable {
    case sage
    case lavender
    case paleBlue
    case sand

    var color: Color {
        switch self {
        case .sage: return CarlPalette.sage
        case .lavender: return CarlPalette.lavender
        case .paleBlue: return CarlPalette.paleBlue
        case .sand: return CarlPalette.sand
        }
    }
}

struct ConversationItem: Identifiable, Equatable {
    let id: UUID
    let author: ConversationAuthor
    let text: String

    init(id: UUID = UUID(), author: ConversationAuthor, text: String) {
        self.id = id
        self.author = author
        self.text = text
    }
}

struct JournalEntry: Identifiable, Equatable {
    let id: UUID
    let date: String
    let title: String
    let preview: String
    let access: String

    init(id: UUID = UUID(), date: String, title: String, preview: String, access: String) {
        self.id = id
        self.date = date
        self.title = title
        self.preview = preview
        self.access = access
    }
}

struct ImportedItem: Identifiable, Equatable {
    let id: UUID
    let title: String
    let subtitle: String
    let type: String
    let shared: Bool

    init(id: UUID = UUID(), title: String, subtitle: String, type: String, shared: Bool) {
        self.id = id
        self.title = title
        self.subtitle = subtitle
        self.type = type
        self.shared = shared
    }
}

struct JourneyItem: Identifiable, Equatable {
    let id: UUID
    let date: String
    let kind: String
    let title: String
    let body: String
    let tint: JourneyAccent

    init(id: UUID = UUID(), date: String, kind: String, title: String, body: String, tint: JourneyAccent) {
        self.id = id
        self.date = date
        self.kind = kind
        self.title = title
        self.body = body
        self.tint = tint
    }
}

enum CarlLogic {
    static func response(for input: String) -> String {
        let lowered = input.lowercased()
        if lowered.contains("stay") || lowered.contains("leave") {
            return "It sounds like the question is no longer only about the role itself. It may also be about which version of yourself feels more alive in each future."
        }
        return "Say a little more. What feels most alive or most unsettled in this for you?"
    }

    static func shouldSuggestMemory(for input: String) -> Bool {
        let lowered = input.lowercased()
        return lowered.contains("stay") || lowered.contains("leave")
    }

    static func journalTitle(from draft: String, maxLength: Int = 34) -> String {
        let cleaned = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        return String(cleaned.prefix(maxLength))
    }

    static func filterJourneyItems(_ items: [JourneyItem], by filter: JourneyFilter) -> [JourneyItem] {
        switch filter {
        case .all:
            return items
        case .journal:
            return items.filter { $0.kind == "Journal entry" }
        case .carlNotes:
            return items.filter { $0.kind == "Carl note" }
        case .reflections:
            return items.filter { $0.kind == "Reflection letter" }
        }
    }

    static func subtitle(for tab: CarlTab) -> String {
        switch tab {
        case .conversation: return "A place to think"
        case .journal: return "A place to keep"
        case .journey: return "A trail of thought"
        case .reflection: return "A quiet room for reflection"
        }
    }
}
