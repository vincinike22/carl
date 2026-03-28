import SwiftUI

struct ContentView: View {
    private let background = Color(red: 247/255, green: 244/255, blue: 239/255)
    private let surface = Color(red: 241/255, green: 238/255, blue: 232/255)
    private let sage = Color(red: 183/255, green: 199/255, blue: 176/255)
    private let lavender = Color(red: 201/255, green: 195/255, blue: 217/255)
    private let paleBlue = Color(red: 199/255, green: 217/255, blue: 232/255)
    private let sand = Color(red: 221/255, green: 208/255, blue: 194/255)
    private let text = Color(red: 47/255, green: 52/255, blue: 55/255)

    @State private var conversationInput = ""
    @State private var journalDraft = ""
    @State private var selectedJournalMode = "Shared with Carl"
    @State private var showingMemorySuggestion = true
    @State private var selectedReflectionRange = "Last 30 days"
    @State private var selectedJourneyFilter = "All"
    @State private var showingConversationInfo = false
    @State private var showingJournalInfo = false
    @State private var showingJourneyInfo = false
    @State private var showingReflectionInfo = false
    @State private var showingImportSheet = false

    @State private var importedItems: [ImportedItem] = [
        ImportedItem(title: "Notion Journal Archive", subtitle: "214 entries • imported yesterday", type: "Notion", shared: true),
        ImportedItem(title: "Old Markdown Notes", subtitle: "48 files • private for now", type: "Markdown", shared: false)
    ]

    @State private var conversationMessages: [ConversationItem] = [
        ConversationItem(author: .user, text: "I keep circling back to the same question. Should I stay in this role or try something new?"),
        ConversationItem(author: .carl, text: "You have returned to this question several times this month. Earlier it sounded like restlessness. Today it sounds more like grief, as if part of you is mourning the life that did not happen."),
        ConversationItem(author: .user, text: "That feels uncomfortably accurate."),
        ConversationItem(author: .carl, text: "You do not have to resolve it tonight. But you may want to notice that your language is becoming more honest each time it returns.")
    ]

    @State private var journalEntries: [JournalEntry] = [
        JournalEntry(date: "March 24", title: "The anxiety is not the real thing", preview: "I realized today that the anxiety is not really about the decision itself. It is about what choosing would force me to admit.", access: "Shared with Carl"),
        JournalEntry(date: "March 20", title: "A quiet morning", preview: "A strange quiet morning. I felt something shift but I could not name it yet.", access: "Private"),
        JournalEntry(date: "March 17", title: "After the conversation with M.", preview: "Conversation with M. left me thinking about what I actually want from this phase of life.", access: "Attached")
    ]

    @State private var journeyItems: [JourneyItem] = [
        JourneyItem(date: "Mar 27", kind: "Reflection letter", title: "Thirty days of quiet reckoning", body: "A slow shift from urgency into honesty has begun to take shape.", tint: .sand),
        JourneyItem(date: "Mar 23", kind: "Carl note", title: "Pattern around leaving", body: "Freedom and stability have appeared together in four conversations since early March.", tint: .sage),
        JourneyItem(date: "Mar 21", kind: "Journal entry", title: "I want stillness now", body: "Silence used to feel like lack. Lately it feels like something I am choosing.", tint: .lavender),
        JourneyItem(date: "Mar 18", kind: "Carl note", title: "Work language softening", body: "Your language around work has become less reactive, with fewer qualifiers and less hedging.", tint: .paleBlue)
    ]

    var body: some View {
        TabView {
            conversationScreen
                .tabItem {
                    Label("Conversation", systemImage: "bubble.left.and.bubble.right")
                }

            journalScreen
                .tabItem {
                    Label("Journal", systemImage: "book.closed")
                }

            journeyScreen
                .tabItem {
                    Label("Journey", systemImage: "point.topleft.down.curvedto.point.bottomright.up")
                }

            reflectionScreen
                .tabItem {
                    Label("Reflection", systemImage: "envelope.open")
                }
        }
        .tint(text)
        .sheet(isPresented: $showingConversationInfo) {
            InfoSheet(
                title: "Conversation",
                text: "Conversation is the main room. Write before your thoughts are fully formed. Carl can notice patterns over time, while shared context and attached journal entries help shape a better response."
            )
            .presentationDetents([.medium])
        }
        .sheet(isPresented: $showingJournalInfo) {
            InfoSheet(
                title: "Journal",
                text: "Journal entries are yours first. Private stays private. Shared with Carl becomes available as context. Attached means you selectively bring an entry into a specific conversation."
            )
            .presentationDetents([.medium])
        }
        .sheet(isPresented: $showingJourneyInfo) {
            InfoSheet(
                title: "Journey",
                text: "Journey is the visible memory of the system. It lets you inspect what came from your writing, what Carl noticed, and what became a reflection over time."
            )
            .presentationDetents([.medium])
        }
        .sheet(isPresented: $showingReflectionInfo) {
            InfoSheet(
                title: "Reflection",
                text: "Reflection letters turn a period of writing and conversation into a calmer synthesis. They are meant to surface themes, shifts, and questions worth sitting with."
            )
            .presentationDetents([.medium])
        }
        .sheet(isPresented: $showingImportSheet) {
            importSheet
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
        }
    }

    private var conversationScreen: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    card {
                        HStack {
                            sectionLabel("Write to Carl", tint: .secondary)
                            Spacer()
                            infoButton {
                                showingConversationInfo = true
                            }
                        }

                        VStack(alignment: .leading, spacing: 14) {
                            TextEditor(text: $conversationInput)
                                .frame(minHeight: 120)
                                .scrollContentBackground(.hidden)
                                .padding(10)
                                .background(background)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                                .overlay(
                                    Group {
                                        if conversationInput.isEmpty {
                                            VStack {
                                                HStack {
                                                    Text("Write what is on your mind...")
                                                        .foregroundStyle(.secondary)
                                                        .padding(.leading, 16)
                                                        .padding(.top, 18)
                                                    Spacer()
                                                }
                                                Spacer()
                                            }
                                        }
                                    }
                                )

                            HStack {
                                HStack(spacing: 10) {
                                    iconPill(systemName: "mic.fill", tint: sand)
                                    iconPill(systemName: "paperclip", tint: lavender)
                                }

                                Spacer()

                                Button {
                                    sendConversation()
                                } label: {
                                    Text("Send")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(text)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(sage.opacity(0.26))
                                        .clipShape(Capsule())
                                }
                            }
                        }
                    }

                    card {
                        sectionLabel("Context", tint: .secondary)

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                chip("Shared memory on", tint: sage)
                                chip("March 17 attached", tint: lavender)
                                chip("Reflection letters enabled", tint: sand)
                            }
                        }
                    }

                    card {
                        HStack {
                            sectionLabel("Conversation", tint: .secondary)
                            Spacer()
                            chip("1 journal attached", tint: lavender)
                        }

                        VStack(alignment: .leading, spacing: 18) {
                            ForEach(conversationMessages) { message in
                                conversationBubble(message)
                                if message.id != conversationMessages.last?.id {
                                    divider
                                }
                            }
                        }

                        if showingMemorySuggestion {
                            VStack(alignment: .leading, spacing: 10) {
                                HStack(spacing: 8) {
                                    subtleMascot(size: 22)

                                    Text("Suggested memory")
                                        .font(.caption)
                                        .foregroundStyle(sage)
                                }

                                Text("The recurring question about staying or leaving has shifted from a practical dilemma into an identity question.")
                                    .font(.system(size: 15, weight: .light, design: .serif))
                                    .foregroundStyle(text.opacity(0.78))

                                HStack(spacing: 10) {
                                    miniButton("Save", filled: true)
                                    miniButton("Edit", filled: false)

                                    Button {
                                        showingMemorySuggestion = false
                                    } label: {
                                        Text("Dismiss")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                }
                                .padding(.top, 4)
                            }
                            .padding()
                            .background(background)
                            .clipShape(RoundedRectangle(cornerRadius: 18))
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(background)
            .navigationTitle("Carl")
        }
    }

    private var journalScreen: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    card {
                        HStack {
                            sectionLabel("New entry", tint: .secondary)
                            Spacer()
                            infoButton {
                                showingJournalInfo = true
                            }
                        }

                        VStack(alignment: .leading, spacing: 14) {
                            TextEditor(text: $journalDraft)
                                .frame(minHeight: 160)
                                .scrollContentBackground(.hidden)
                                .padding(10)
                                .background(background)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                                .overlay(
                                    Group {
                                        if journalDraft.isEmpty {
                                            VStack {
                                                HStack {
                                                    Text("Write freely. Nothing needs to be polished.")
                                                        .foregroundStyle(.secondary)
                                                        .padding(.leading, 16)
                                                        .padding(.top, 18)
                                                    Spacer()
                                                }
                                                Spacer()
                                            }
                                        }
                                    }
                                )

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 10) {
                                    journalModePill("Private")
                                    journalModePill("Shared with Carl")
                                    journalModePill("Attached")
                                }
                            }

                            HStack {
                                Button {
                                    showingImportSheet = true
                                } label: {
                                    Text("Import writing")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(text)
                                        .padding(.horizontal, 14)
                                        .padding(.vertical, 10)
                                        .background(sand.opacity(0.22))
                                        .clipShape(Capsule())
                                }

                                Spacer()

                                Button {
                                    saveJournalEntry()
                                } label: {
                                    Text("Save entry")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(text)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(lavender.opacity(0.26))
                                        .clipShape(Capsule())
                                }
                            }
                        }
                    }

                    card {
                        sectionLabel("Recent entries", tint: .secondary)

                        VStack(alignment: .leading, spacing: 14) {
                            ForEach(journalEntries) { entry in
                                journalRow(entry)
                                if entry.id != journalEntries.last?.id {
                                    divider
                                }
                            }
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(background)
            .navigationTitle("Journal")
        }
    }

    private var journeyScreen: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 18) {
                    HStack {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                filterPill("All")
                                filterPill("Journal")
                                filterPill("Carl notes")
                                filterPill("Reflections")
                            }
                        }

                        infoButton {
                            showingJourneyInfo = true
                        }
                    }

                    VStack(alignment: .leading, spacing: 18) {
                        ForEach(filteredJourneyItems) { item in
                            timelineRow(item)
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(background)
            .navigationTitle("Journey")
        }
    }

    private var reflectionScreen: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    HStack {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                reflectionRangePill("Last 7 days")
                                reflectionRangePill("Last 30 days")
                                reflectionRangePill("Since March 1")
                                reflectionRangePill("Custom range")
                            }
                        }

                        infoButton {
                            showingReflectionInfo = true
                        }
                    }

                    card {
                        VStack(alignment: .leading, spacing: 18) {
                            HStack(spacing: 8) {
                                subtleMascot(size: 22)

                                Text("Reflection Letter")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }

                            Text("February 25 to March 27, 2026")
                                .font(.caption)
                                .foregroundStyle(.secondary)

                            divider

                            reflectionBlock(
                                title: "Recurring themes",
                                body: "The question of staying versus leaving has been the central thread. Early on it felt like restlessness. More recently, it reads as a slow reckoning with what you actually need versus what you think you should want.",
                                tint: sage
                            )

                            divider

                            reflectionBlock(
                                title: "Noticeable shifts",
                                body: "Your tone has changed. In the first week, you were writing quickly, in fragments. By mid-month, your entries became slower and more spacious.",
                                tint: lavender
                            )

                            divider

                            reflectionBlock(
                                title: "A question to sit with",
                                body: "What would it look like to make a choice not because you have resolved every doubt, but because you trust yourself to adjust once you are in motion?",
                                tint: paleBlue,
                                serif: true
                            )

                            HStack {
                                Spacer()
                                Button {
                                } label: {
                                    Text("Generate again")
                                        .font(.system(size: 14, weight: .medium))
                                        .foregroundStyle(text)
                                        .padding(.horizontal, 16)
                                        .padding(.vertical, 10)
                                        .background(sand.opacity(0.28))
                                        .clipShape(Capsule())
                                }
                            }
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(background)
            .navigationTitle("Reflection")
        }
    }

    private var importSheet: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    card {
                        sectionLabel("Import sources", tint: .secondary)

                        VStack(alignment: .leading, spacing: 12) {
                            importOption(title: "Notion", subtitle: "Import journals, notes, databases, and long-form reflections", tint: lavender)
                            importOption(title: "Markdown and text files", subtitle: "Bring folders of .md and .txt writing into Carl", tint: sage)
                            importOption(title: "Documents", subtitle: "Later: PDFs, rich text, and exported archives", tint: sand)
                        }
                    }

                    card {
                        sectionLabel("Imported materials", tint: .secondary)

                        VStack(alignment: .leading, spacing: 14) {
                            ForEach(importedItems) { item in
                                importedRow(item)
                                if item.id != importedItems.last?.id {
                                    divider
                                }
                            }
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(background)
            .navigationTitle("Import")
        }
    }

    private var filteredJourneyItems: [JourneyItem] {
        switch selectedJourneyFilter {
        case "Journal":
            return journeyItems.filter { $0.kind == "Journal entry" }
        case "Carl notes":
            return journeyItems.filter { $0.kind == "Carl note" }
        case "Reflections":
            return journeyItems.filter { $0.kind == "Reflection letter" }
        default:
            return journeyItems
        }
    }

    private func sendConversation() {
        guard !conversationInput.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let textValue = conversationInput
        conversationMessages.append(ConversationItem(author: .user, text: textValue))

        if textValue.lowercased().contains("stay") || textValue.lowercased().contains("leave") {
            conversationMessages.append(
                ConversationItem(
                    author: .carl,
                    text: "It sounds like the question is no longer only about the role itself. It may also be about which version of yourself feels more alive in each future."
                )
            )
            showingMemorySuggestion = true
        } else {
            conversationMessages.append(
                ConversationItem(
                    author: .carl,
                    text: "Say a little more. What feels most alive or most unsettled in this for you?"
                )
            )
        }

        conversationInput = ""
    }

    private func saveJournalEntry() {
        let cleaned = journalDraft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !cleaned.isEmpty else { return }

        let newEntry = JournalEntry(
            date: "Today",
            title: String(cleaned.prefix(34)),
            preview: cleaned,
            access: selectedJournalMode
        )

        journalEntries.insert(newEntry, at: 0)
        journalDraft = ""
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.18))
            .frame(height: 1)
    }

    @ViewBuilder
    private func card<Content: View>(tint: Color? = nil, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            content()
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(tint ?? surface)
        .clipShape(RoundedRectangle(cornerRadius: 24))
    }

    @ViewBuilder
    private func sectionLabel(_ value: String, tint: Color) -> some View {
        Text(value.uppercased())
            .font(.caption)
            .foregroundStyle(tint)
    }

    @ViewBuilder
    private func chip(_ title: String, tint: Color) -> some View {
        Text(title)
            .font(.caption)
            .foregroundStyle(tint)
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(tint.opacity(0.16))
            .clipShape(Capsule())
    }

    @ViewBuilder
    private func miniButton(_ title: String, filled: Bool) -> some View {
        Text(title)
            .font(.caption)
            .foregroundStyle(filled ? text : .secondary)
            .padding(.horizontal, 12)
            .padding(.vertical, 7)
            .background(filled ? sage.opacity(0.22) : Color.clear)
            .overlay(
                Capsule()
                    .stroke(filled ? Color.clear : Color.secondary.opacity(0.2), lineWidth: 1)
            )
            .clipShape(Capsule())
    }

    @ViewBuilder
    private func iconPill(systemName: String, tint: Color) -> some View {
        Image(systemName: systemName)
            .font(.system(size: 13, weight: .medium))
            .foregroundStyle(text.opacity(0.75))
            .frame(width: 34, height: 34)
            .background(tint.opacity(0.22))
            .clipShape(Circle())
    }

    @ViewBuilder
    private func infoButton(action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: "info.circle")
                .font(.system(size: 17, weight: .medium))
                .foregroundStyle(text.opacity(0.72))
                .frame(width: 30, height: 30)
                .background(background)
                .clipShape(Circle())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func journalModePill(_ title: String) -> some View {
        let selected = selectedJournalMode == title

        Button {
            selectedJournalMode = title
        } label: {
            Text(title)
                .font(.caption)
                .foregroundStyle(selected ? text : .secondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? background : Color.clear)
                .overlay(
                    Capsule()
                        .stroke(selected ? text.opacity(0.18) : Color.secondary.opacity(0.18), lineWidth: 1)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func filterPill(_ title: String) -> some View {
        let selected = selectedJourneyFilter == title

        Button {
            selectedJourneyFilter = title
        } label: {
            Text(title)
                .font(.caption)
                .foregroundStyle(selected ? text : .secondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? background : Color.clear)
                .overlay(
                    Capsule()
                        .stroke(selected ? text.opacity(0.18) : Color.secondary.opacity(0.18), lineWidth: 1)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func reflectionRangePill(_ title: String) -> some View {
        let selected = selectedReflectionRange == title

        Button {
            selectedReflectionRange = title
        } label: {
            Text(title)
                .font(.caption)
                .foregroundStyle(selected ? text : .secondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? background : Color.clear)
                .overlay(
                    Capsule()
                        .stroke(selected ? text.opacity(0.18) : Color.secondary.opacity(0.18), lineWidth: 1)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
    }

    @ViewBuilder
    private func conversationBubble(_ message: ConversationItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            if message.author == .carl {
                HStack(spacing: 8) {
                    subtleMascot(size: 22)

                    Text("Carl")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            Text(message.text)
                .font(.system(size: 16, weight: message.author == .user ? .regular : .light))
                .foregroundStyle(message.author == .user ? text : text.opacity(0.82))
        }
    }

    @ViewBuilder
    private func journalRow(_ entry: JournalEntry) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(entry.date)
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Spacer()

                chip(entry.access, tint: accessTint(for: entry.access))
            }

            Text(entry.title)
                .font(.system(size: 18, weight: .light, design: .serif))
                .foregroundStyle(text)

            Text(entry.preview)
                .font(.system(size: 15))
                .foregroundStyle(text.opacity(0.74))
        }
    }

    @ViewBuilder
    private func timelineRow(_ item: JourneyItem) -> some View {
        HStack(alignment: .top, spacing: 14) {
            Circle()
                .fill(item.tint.color)
                .frame(width: 10, height: 10)
                .padding(.top, 14)

            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    Text(item.date)
                        .font(.caption)
                        .foregroundStyle(.secondary)

                    Spacer()

                    chip(item.kind, tint: item.tint.color)
                }

                card {
                    Text(item.title)
                        .font(.system(size: 18, weight: .light, design: .serif))
                        .foregroundStyle(text)

                    Text(item.body)
                        .font(.system(size: 15))
                        .foregroundStyle(text.opacity(0.74))
                }
            }
        }
    }

    @ViewBuilder
    private func reflectionBlock(title: String, body: String, tint: Color, serif: Bool = false) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            sectionLabel(title, tint: tint)

            Text(body)
                .font(.system(size: serif ? 18 : 15, weight: .light, design: serif ? .serif : .default))
                .foregroundStyle(text.opacity(serif ? 0.88 : 0.74))
        }
    }

    @ViewBuilder
    private func importOption(title: String, subtitle: String, tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .light, design: .serif))
                    .foregroundStyle(text)

                Spacer()

                iconPill(systemName: "arrow.down.doc", tint: tint)
            }

            Text(subtitle)
                .font(.system(size: 15))
                .foregroundStyle(text.opacity(0.74))
        }
        .padding()
        .background(background)
        .clipShape(RoundedRectangle(cornerRadius: 18))
    }

    @ViewBuilder
    private func importedRow(_ item: ImportedItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(item.title)
                    .font(.system(size: 18, weight: .light, design: .serif))
                    .foregroundStyle(text)

                Spacer()

                chip(item.type, tint: item.shared ? sage : sand)
            }

            Text(item.subtitle)
                .font(.system(size: 15))
                .foregroundStyle(text.opacity(0.74))

            Text(item.shared ? "Available to Carl" : "Private for now")
                .font(.caption)
                .foregroundStyle(item.shared ? sage : sand)
        }
    }

    @ViewBuilder
    private func subtleMascot(size: CGFloat) -> some View {
        ZStack {
            Circle()
                .fill(sand.opacity(0.92))
                .frame(width: size, height: size)

            Circle()
                .stroke(sage.opacity(0.52), lineWidth: max(1, size * 0.08))
                .frame(width: size * 0.92, height: size * 0.92)

            Circle()
                .stroke(text.opacity(0.42), lineWidth: max(1, size * 0.035))
                .frame(width: size * 0.34, height: size * 0.34)
                .offset(x: -size * 0.12, y: -size * 0.03)

            Circle()
                .stroke(text.opacity(0.42), lineWidth: max(1, size * 0.035))
                .frame(width: size * 0.34, height: size * 0.34)
                .offset(x: size * 0.12, y: -size * 0.03)

            Rectangle()
                .fill(text.opacity(0.42))
                .frame(width: size * 0.12, height: max(1, size * 0.025))
                .offset(y: -size * 0.03)

            Path { path in
                path.move(to: CGPoint(x: size * 0.30, y: size * 0.63))
                path.addQuadCurve(
                    to: CGPoint(x: size * 0.70, y: size * 0.63),
                    control: CGPoint(x: size * 0.50, y: size * 0.76)
                )
            }
            .stroke(text.opacity(0.38), lineWidth: max(1, size * 0.04))
            .frame(width: size, height: size)
        }
        .shadow(color: sage.opacity(0.08), radius: 8, y: 4)
    }

    private func accessTint(for access: String) -> Color {
        switch access {
        case "Shared with Carl":
            return sage
        case "Attached":
            return lavender
        default:
            return sand
        }
    }
}

private struct InfoSheet: View {
    let title: String
    let text: String

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 16) {
                Text(title)
                    .font(.system(size: 28, weight: .light, design: .serif))

                Text(text)
                    .font(.system(size: 16))
                    .foregroundStyle(.secondary)

                Spacer()
            }
            .padding(24)
        }
    }
}

private struct ConversationItem: Identifiable {
    enum Author {
        case user
        case carl
    }

    let id = UUID()
    let author: Author
    let text: String
}

private struct JournalEntry: Identifiable {
    let id = UUID()
    let date: String
    let title: String
    let preview: String
    let access: String
}

private struct ImportedItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let type: String
    let shared: Bool
}

private struct JourneyItem: Identifiable {
    enum Accent {
        case sage
        case lavender
        case paleBlue
        case sand

        var color: Color {
            switch self {
            case .sage:
                return Color(red: 183/255, green: 199/255, blue: 176/255)
            case .lavender:
                return Color(red: 201/255, green: 195/255, blue: 217/255)
            case .paleBlue:
                return Color(red: 199/255, green: 217/255, blue: 232/255)
            case .sand:
                return Color(red: 221/255, green: 208/255, blue: 194/255)
            }
        }
    }

    let id = UUID()
    let date: String
    let kind: String
    let title: String
    let body: String
    let tint: Accent
}

#Preview {
    ContentView()
}
