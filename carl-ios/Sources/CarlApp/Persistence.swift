import Foundation

struct CarlSnapshot: Codable, Equatable {
    var selectedJournalMode: String
    var selectedReflectionRange: String
    var selectedJourneyFilter: String
    var showingMemorySuggestion: Bool
    var conversationInput: String
    var journalDraft: String
    var importedItems: [ImportedItemRecord]
    var conversationMessages: [ConversationItemRecord]
    var journalEntries: [JournalEntryRecord]
    var journeyItems: [JourneyItemRecord]
}

struct ImportedItemRecord: Codable, Equatable {
    var title: String
    var subtitle: String
    var type: String
    var shared: Bool
}

struct ConversationItemRecord: Codable, Equatable {
    var author: String
    var text: String
}

struct JournalEntryRecord: Codable, Equatable {
    var date: String
    var title: String
    var preview: String
    var access: String
}

struct JourneyItemRecord: Codable, Equatable {
    var date: String
    var kind: String
    var title: String
    var body: String
    var tint: String
}

protocol CarlPersistence {
    func load() throws -> CarlSnapshot?
    func save(_ snapshot: CarlSnapshot) throws
}

struct FileCarlPersistence: CarlPersistence {
    let url: URL
    let encoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        return encoder
    }()
    let decoder = JSONDecoder()

    init(filename: String = "carl-state.json") {
        let baseURL = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask).first
            ?? FileManager.default.temporaryDirectory
        let directory = baseURL.appendingPathComponent("CarlApp", isDirectory: true)
        try? FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
        self.url = directory.appendingPathComponent(filename)
    }

    func load() throws -> CarlSnapshot? {
        guard FileManager.default.fileExists(atPath: url.path) else { return nil }
        let data = try Data(contentsOf: url)
        return try decoder.decode(CarlSnapshot.self, from: data)
    }

    func save(_ snapshot: CarlSnapshot) throws {
        let data = try encoder.encode(snapshot)
        try data.write(to: url, options: .atomic)
    }
}

final class InMemoryCarlPersistence: CarlPersistence {
    var snapshot: CarlSnapshot?

    func load() throws -> CarlSnapshot? {
        snapshot
    }

    func save(_ snapshot: CarlSnapshot) throws {
        self.snapshot = snapshot
    }
}
