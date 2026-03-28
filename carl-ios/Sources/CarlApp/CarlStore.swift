import SwiftUI

@MainActor
final class CarlStore: ObservableObject {
    @Published var selectedTab: CarlTab = .conversation
    @Published var selectedJournalMode: JournalMode = .sharedWithCarl { didSet { persistIfPossible() } }
    @Published var selectedReflectionRange: ReflectionRange = .last30Days { didSet { persistIfPossible() } }
    @Published var selectedJourneyFilter: JourneyFilter = .all { didSet { persistIfPossible() } }
    @Published var showingMemorySuggestion = true { didSet { persistIfPossible() } }
    @Published var activeInfoTopic: CarlInfoTopic?
    @Published var showingImportSheet = false
    @Published var showingMemoryPreferences = false
    @Published var memoryAccessMode: MemoryAccessMode = .selectedOnly
    @Published var reflectionAutomationEnabled = true
    @Published var isSending = false
    @Published var lastError: String?

    @Published var conversationInput = "" { didSet { persistIfPossible() } }
    @Published var journalDraft = "" { didSet { persistIfPossible() } }

    @Published var importedItems: [ImportedItem] = [] { didSet { persistIfPossible() } }
    @Published var conversationMessages: [ConversationItem] = [] { didSet { persistIfPossible() } }
    @Published var journalEntries: [JournalEntry] = [] { didSet { persistIfPossible() } }
    @Published var journeyItems: [JourneyItem] = [] { didSet { persistIfPossible() } }

    private let persistence: CarlPersistence
    private let apiClient: CarlAPIClient
    private let userId: String
    private var isHydrating = false

    init(
        persistence: CarlPersistence = FileCarlPersistence(),
        apiClient: CarlAPIClient = CarlAPIClient(),
        userDefaults: UserDefaults = .standard
    ) {
        self.persistence = persistence
        self.apiClient = apiClient
        self.userId = CarlUserIdentity.loadOrCreate(defaults: userDefaults)
        seedDefaults()
        hydrate()
    }

    var filteredJourneyItems: [JourneyItem] {
        CarlLogic.filterJourneyItems(journeyItems, by: selectedJourneyFilter)
    }

    var conversationSubtitle: String { CarlLogic.subtitle(for: .conversation) }
    var journalSubtitle: String { CarlLogic.subtitle(for: .journal) }
    var journeySubtitle: String { CarlLogic.subtitle(for: .journey) }
    var reflectionSubtitle: String { CarlLogic.subtitle(for: .reflection) }

    func sendConversation() {
        let trimmed = conversationInput.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        conversationMessages.append(ConversationItem(author: .user, text: trimmed))
        if CarlLogic.shouldSuggestMemory(for: trimmed) {
            showingMemorySuggestion = true
        }
        conversationInput = ""
        isSending = true
        lastError = nil
        persistIfPossible()

        Task {
            do {
                let response = try await apiClient.sendMessage(userId: userId, message: trimmed)
                await MainActor.run {
                    self.conversationMessages.append(ConversationItem(author: .carl, text: response.reply))
                    self.isSending = false
                    self.persistIfPossible()
                }
            } catch {
                await MainActor.run {
                    self.conversationMessages.append(ConversationItem(author: .carl, text: CarlLogic.response(for: trimmed)))
                    self.lastError = String(describing: error)
                    self.isSending = false
                    self.persistIfPossible()
                }
            }
        }
    }

    func saveJournalEntry() {
        let cleaned = journalDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleaned.isEmpty else { return }

        let entry = JournalEntry(
            date: "Today",
            title: CarlLogic.journalTitle(from: cleaned),
            preview: cleaned,
            access: selectedJournalMode.rawValue
        )
        journalEntries.insert(entry, at: 0)
        journalDraft = ""
        persistIfPossible()
    }

    func dismissMemorySuggestion() {
        showingMemorySuggestion = false
    }

    func presentInfo(_ topic: CarlInfoTopic) {
        activeInfoTopic = topic
    }

    private func seedDefaults() {
        importedItems = [
            ImportedItem(title: "Notion Journal Archive", subtitle: "214 entries • imported yesterday", type: "Notion", shared: true),
            ImportedItem(title: "Old Markdown Notes", subtitle: "48 files • private for now", type: "Markdown", shared: false)
        ]

        conversationMessages = [
            ConversationItem(author: .user, text: "I keep circling back to the same question. Should I stay in this role or try something new?"),
            ConversationItem(author: .carl, text: "You have returned to this question several times this month. Earlier it sounded like restlessness. Today it sounds more like grief, as if part of you is mourning the life that did not happen."),
            ConversationItem(author: .user, text: "That feels uncomfortably accurate."),
            ConversationItem(author: .carl, text: "You do not have to resolve it tonight. But you may want to notice that your language is becoming more honest each time it returns.")
        ]

        journalEntries = [
            JournalEntry(date: "March 24", title: "The anxiety is not the real thing", preview: "I realized today that the anxiety is not really about the decision itself. It is about what choosing would force me to admit.", access: "Shared with Carl"),
            JournalEntry(date: "March 20", title: "A quiet morning", preview: "A strange quiet morning. I felt something shift but I could not name it yet.", access: "Private"),
            JournalEntry(date: "March 17", title: "After the conversation with M.", preview: "Conversation with M. left me thinking about what I actually want from this phase of life.", access: "Attached")
        ]

        journeyItems = [
            JourneyItem(date: "Mar 27", kind: "Reflection letter", title: "Thirty days of quiet reckoning", body: "A slow shift from urgency into honesty has begun to take shape.", tint: .sand),
            JourneyItem(date: "Mar 23", kind: "Carl note", title: "Pattern around leaving", body: "Freedom and stability have appeared together in four conversations since early March.", tint: .sage),
            JourneyItem(date: "Mar 21", kind: "Journal entry", title: "I want stillness now", body: "Silence used to feel like lack. Lately it feels like something I am choosing.", tint: .lavender),
            JourneyItem(date: "Mar 18", kind: "Carl note", title: "Work language softening", body: "Your language around work has become less reactive, with fewer qualifiers and less hedging.", tint: .paleBlue)
        ]
    }

    private func hydrate() {
        guard let snapshot = try? persistence.load(), let snapshot else { return }
        isHydrating = true
        defer { isHydrating = false }

        selectedJournalMode = JournalMode(rawValue: snapshot.selectedJournalMode) ?? .sharedWithCarl
        selectedReflectionRange = ReflectionRange(rawValue: snapshot.selectedReflectionRange) ?? .last30Days
        selectedJourneyFilter = JourneyFilter(rawValue: snapshot.selectedJourneyFilter) ?? .all
        showingMemorySuggestion = snapshot.showingMemorySuggestion
        conversationInput = snapshot.conversationInput
        journalDraft = snapshot.journalDraft
        importedItems = snapshot.importedItems.map { ImportedItem(title: $0.title, subtitle: $0.subtitle, type: $0.type, shared: $0.shared) }
        conversationMessages = snapshot.conversationMessages.map { ConversationItem(author: ConversationAuthor(rawValue: $0.author) ?? .user, text: $0.text) }
        journalEntries = snapshot.journalEntries.map { JournalEntry(date: $0.date, title: $0.title, preview: $0.preview, access: $0.access) }
        journeyItems = snapshot.journeyItems.map {
            JourneyItem(date: $0.date, kind: $0.kind, title: $0.title, body: $0.body, tint: JourneyAccent(rawValue: $0.tint) ?? .sage)
        }
    }

    private func persistIfPossible() {
        guard !isHydrating else { return }
        let snapshot = CarlSnapshot(
            selectedJournalMode: selectedJournalMode.rawValue,
            selectedReflectionRange: selectedReflectionRange.rawValue,
            selectedJourneyFilter: selectedJourneyFilter.rawValue,
            showingMemorySuggestion: showingMemorySuggestion,
            conversationInput: conversationInput,
            journalDraft: journalDraft,
            importedItems: importedItems.map { ImportedItemRecord(title: $0.title, subtitle: $0.subtitle, type: $0.type, shared: $0.shared) },
            conversationMessages: conversationMessages.map { ConversationItemRecord(author: $0.author.rawValue, text: $0.text) },
            journalEntries: journalEntries.map { JournalEntryRecord(date: $0.date, title: $0.title, preview: $0.preview, access: $0.access) },
            journeyItems: journeyItems.map { JourneyItemRecord(date: $0.date, kind: $0.kind, title: $0.title, body: $0.body, tint: $0.tint.rawValue) }
        )
        try? persistence.save(snapshot)
    }
}
