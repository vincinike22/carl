import SwiftUI

struct ContentView: View {
private let background = Color(red: 247/255, green: 244/255, blue: 239/255)
private let surface = Color(red: 242/255, green: 238/255, blue: 233/255)
private let elevated = Color.white.opacity(0.62)
private let sage = Color(red: 183/255, green: 199/255, blue: 176/255)
private let lavender = Color(red: 201/255, green: 195/255, blue: 217/255)
private let paleBlue = Color(red: 199/255, green: 217/255, blue: 232/255)
private let sand = Color(red: 221/255, green: 208/255, blue: 194/255)
private let ink = Color(red: 47/255, green: 52/255, blue: 55/255)

@State private var conversationInput = ""
@State private var journalDraft = ""
@State private var selectedJournalMode = "Shared with Carl"
@State private var selectedReflectionRange = "Last 30 days"
@State private var selectedJourneyFilter = "All"
@State private var showingMemorySuggestion = true
@State private var showingConversationInfo = false
@State private var showingJournalInfo = false
@State private var showingJourneyInfo = false
@State private var showingReflectionInfo = false
@State private var showingImportSheet = false
@State private var isSending = false

@AppStorage("carl_user_id") private var userId: String = UUID().uuidString

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
.tint(ink)
.sheet(isPresented: $showingConversationInfo) {
InfoSheet(title: "Conversation", text: "Conversation is the main chamber. Start quickly, then let meaning emerge. Shared context and attached entries help Carl respond with more depth.")
.presentationDetents([.medium])
}
.sheet(isPresented: $showingJournalInfo) {
InfoSheet(title: "Journal", text: "Journal is yours first. Private stays private. Shared with Carl becomes available as context. Attached means you bring it into a specific exchange on purpose.")
.presentationDetents([.medium])
}
.sheet(isPresented: $showingJourneyInfo) {
InfoSheet(title: "Journey", text: "Journey keeps memory inspectable. You can see what came from you, what Carl noticed, and what later became reflection.")
.presentationDetents([.medium])
}
.sheet(isPresented: $showingReflectionInfo) {
InfoSheet(title: "Reflection", text: "Reflection letters are slower syntheses. They collect themes, shifts, and questions that deserve a calmer form than chat.")
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
ScrollView(showsIndicators: false) {
VStack(alignment: .leading, spacing: 18) {
topBar(title: "Carl", subtitle: "A place to think") {
showingConversationInfo = true
}

featureCard {
VStack(alignment: .leading, spacing: 14) {
labelRow("Write", tone: .secondary)

TextEditor(text: $conversationInput)
.frame(minHeight: 126)
.scrollContentBackground(.hidden)
.padding(12)
.background(background)
.clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
.overlay(alignment: .topLeading) {
if conversationInput.isEmpty {
Text("Write what is on your mind...")
.foregroundStyle(.secondary)
.padding(.leading, 18)
.padding(.top, 20)
}
}

HStack {
HStack(spacing: 10) {
softIcon(systemName: "mic.fill", tint: sand)
softIcon(systemName: "paperclip", tint: lavender)
}

Spacer()

Button {
sendConversation()
} label: {
if isSending {
ProgressView()
.tint(ink)
.padding(.horizontal, 18)
.padding(.vertical, 11)
} else {
Text("Send")
.font(.system(size: 14, weight: .medium))
.foregroundStyle(ink)
.padding(.horizontal, 18)
.padding(.vertical, 11)
}
}
.background(sage.opacity(0.34))
.clipShape(Capsule())
.disabled(isSending)
}
}
}

featureCard {
VStack(alignment: .leading, spacing: 12) {
labelRow("Context", tone: .secondary)

ScrollView(.horizontal, showsIndicators: false) {
HStack(spacing: 10) {
chip("Shared memory on", tint: sage)
chip("March 17 attached", tint: lavender)
chip("Reflection letters enabled", tint: sand)
}
}
}
}

featureCard {
VStack(alignment: .leading, spacing: 18) {
HStack {
labelRow("Conversation", tone: .secondary)
Spacer()
chip("1 journal attached", tint: lavender)
}

ForEach(conversationMessages) { message in
conversationBubble(message)
if message.id != conversationMessages.last?.id {
divider
}
}

if showingMemorySuggestion {
memorySuggestionCard
}
}
}
}
.padding(.horizontal, 20)
.padding(.top, 12)
.padding(.bottom, 34)
}
.background(background.ignoresSafeArea())
}
}

private var journalScreen: some View {
NavigationStack {
ScrollView(showsIndicators: false) {
VStack(alignment: .leading, spacing: 18) {
topBar(title: "Journal", subtitle: "A place to keep") {
showingJournalInfo = true
}

featureCard {
VStack(alignment: .leading, spacing: 14) {
labelRow("New Entry", tone: .secondary)

TextEditor(text: $journalDraft)
.frame(minHeight: 180)
.scrollContentBackground(.hidden)
.padding(12)
.background(background)
.clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
.overlay(alignment: .topLeading) {
if journalDraft.isEmpty {
Text("Write freely.")
.foregroundStyle(.secondary)
.padding(.leading, 18)
.padding(.top, 20)
}
}

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
.foregroundStyle(ink)
.padding(.horizontal, 14)
.padding(.vertical, 10)
.background(sand.opacity(0.24))
.clipShape(Capsule())
}

Spacer()

Button {
saveJournalEntry()
} label: {
Text("Save entry")
.font(.system(size: 14, weight: .medium))
.foregroundStyle(ink)
.padding(.horizontal, 16)
.padding(.vertical, 10)
.background(lavender.opacity(0.30))
.clipShape(Capsule())
}
}
}
}

featureCard {
VStack(alignment: .leading, spacing: 14) {
labelRow("Recent", tone: .secondary)

ForEach(journalEntries) { entry in
journalRow(entry)
if entry.id != journalEntries.last?.id {
divider
}
}
}
}
}
.padding(.horizontal, 20)
.padding(.top, 12)
.padding(.bottom, 34)
}
.background(background.ignoresSafeArea())
}
}

private var journeyScreen: some View {
NavigationStack {
ScrollView(showsIndicators: false) {
VStack(alignment: .leading, spacing: 18) {
topBar(title: "Journey", subtitle: "A trail of thought") {
showingJourneyInfo = true
}

ScrollView(.horizontal, showsIndicators: false) {
HStack(spacing: 10) {
filterPill("All")
filterPill("Journal")
filterPill("Carl notes")
filterPill("Reflections")
}
.padding(.horizontal, 2)
}

VStack(alignment: .leading, spacing: 16) {
ForEach(filteredJourneyItems) { item in
timelineRow(item)
}
}
}
.padding(.horizontal, 20)
.padding(.top, 12)
.padding(.bottom, 34)
}
.background(background.ignoresSafeArea())
}
}

private var reflectionScreen: some View {
NavigationStack {
ScrollView(showsIndicators: false) {
VStack(alignment: .leading, spacing: 18) {
topBar(title: "Reflection", subtitle: "A quiet room for reflection") {
showingReflectionInfo = true
}

ScrollView(.horizontal, showsIndicators: false) {
HStack(spacing: 10) {
reflectionRangePill("Last 7 days")
reflectionRangePill("Last 30 days")
reflectionRangePill("Since March 1")
reflectionRangePill("Custom range")
}
.padding(.horizontal, 2)
}

featureCard {
VStack(alignment: .leading, spacing: 18) {
HStack(spacing: 10) {
mascotSeal(size: 28)

VStack(alignment: .leading, spacing: 2) {
Text("Reflection Letter")
.font(.caption)
.foregroundStyle(.secondary)

Text("February 25 to March 27, 2026")
.font(.caption)
.foregroundStyle(.secondary)
}
}

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
.foregroundStyle(ink)
.padding(.horizontal, 16)
.padding(.vertical, 10)
.background(sand.opacity(0.28))
.clipShape(Capsule())
}
}
}
}
}
.padding(.horizontal, 20)
.padding(.top, 12)
.padding(.bottom, 34)
}
.background(background.ignoresSafeArea())
}
}

private var importSheet: some View {
NavigationStack {
ScrollView(showsIndicators: false) {
VStack(alignment: .leading, spacing: 18) {
featureCard {
VStack(alignment: .leading, spacing: 12) {
labelRow("Import Sources", tone: .secondary)
importOption(title: "Notion", subtitle: "Import journals, notes, databases, and long-form reflections", tint: lavender)
importOption(title: "Markdown and text files", subtitle: "Bring folders of .md and .txt writing into Carl", tint: sage)
importOption(title: "Documents", subtitle: "Later: PDFs, rich text, and exported archives", tint: sand)
}
}

featureCard {
VStack(alignment: .leading, spacing: 14) {
labelRow("Imported", tone: .secondary)
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
.background(background.ignoresSafeArea())
.navigationTitle("Import")
}
}

private var memorySuggestionCard: some View {
VStack(alignment: .leading, spacing: 10) {
HStack(spacing: 8) {
mascotSeal(size: 24)
Text("Suggested memory")
.font(.caption)
.foregroundStyle(sage)
}

Text("The recurring question about staying or leaving has shifted from a practical dilemma into an identity question.")
.font(.system(size: 15, weight: .light, design: .serif))
.foregroundStyle(ink.opacity(0.78))

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
.padding(.top, 2)
}
.padding(16)
.background(background)
.clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
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
let cleaned = conversationInput.trimmingCharacters(in: .whitespacesAndNewlines)
guard !cleaned.isEmpty, !isSending else { return }

let userText = cleaned
conversationInput = ""
conversationMessages.append(ConversationItem(author: .user, text: userText))
isSending = true

Task {
do {
let reply = try await sendMessageToBackend(userText)
await MainActor.run {
conversationMessages.append(ConversationItem(author: .carl, text: reply.reply))
showingMemorySuggestion = reply.mode == "synthesize"
isSending = false
}
} catch {
await MainActor.run {
conversationMessages.append(
ConversationItem(
author: .carl,
text: "I tried to reach the server, but the connection failed. Check whether the backend URL is correct and the server is running."
)
)
isSending = false
}
print("Carl backend error:", error)
}
}
}

private func sendMessageToBackend(_ message: String) async throws -> ChatResponse {
guard let url = URL(string: "http://89.167.5.112:8787/chat") else {
throw URLError(.badURL)
}

let payload = ChatRequest(userId: userId, message: message)

var request = URLRequest(url: url)
request.httpMethod = "POST"
request.setValue("application/json", forHTTPHeaderField: "Content-Type")
request.timeoutInterval = 30
request.httpBody = try JSONEncoder().encode(payload)

let (data, response) = try await URLSession.shared.data(for: request)

guard let httpResponse = response as? HTTPURLResponse else {
throw URLError(.badServerResponse)
}

guard (200...299).contains(httpResponse.statusCode) else {
let body = String(data: data, encoding: .utf8) ?? "Unknown server error"
throw NSError(domain: "CarlBackend", code: httpResponse.statusCode, userInfo: [
NSLocalizedDescriptionKey: body
])
}

return try JSONDecoder().decode(ChatResponse.self, from: data)
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
.fill(Color.secondary.opacity(0.16))
.frame(height: 1)
}

@ViewBuilder
private func topBar(title: String, subtitle: String, infoAction: @escaping () -> Void) -> some View {
HStack(alignment: .center) {
VStack(alignment: .leading, spacing: 2) {
Text(title)
.font(.system(size: 30, weight: .light, design: .serif))
.foregroundStyle(ink)

Text(subtitle)
.font(.system(size: 13))
.foregroundStyle(.secondary)
}

Spacer()

Button(action: infoAction) {
Image(systemName: "info.circle")
.font(.system(size: 18, weight: .medium))
.foregroundStyle(ink.opacity(0.75))
.frame(width: 34, height: 34)
.background(elevated)
.clipShape(Circle())
}
.buttonStyle(.plain)
}
}

@ViewBuilder
private func featureCard<Content: View>(@ViewBuilder content: () -> Content) -> some View {
VStack(alignment: .leading, spacing: 16) {
content()
}
.padding(18)
.frame(maxWidth: .infinity, alignment: .leading)
.background(
RoundedRectangle(cornerRadius: 28, style: .continuous)
.fill(surface)
.overlay(
RoundedRectangle(cornerRadius: 28, style: .continuous)
.stroke(Color.white.opacity(0.45), lineWidth: 1)
)
)
.shadow(color: Color.black.opacity(0.03), radius: 16, y: 8)
}

@ViewBuilder
private func labelRow(_ value: String, tone: Color) -> some View {
Text(value.uppercased())
.font(.caption)
.tracking(0.8)
.foregroundStyle(tone)
}

@ViewBuilder
private func chip(_ title: String, tint: Color) -> some View {
Text(title)
.font(.caption)
.foregroundStyle(tint)
.padding(.horizontal, 11)
.padding(.vertical, 7)
.background(tint.opacity(0.16))
.clipShape(Capsule())
}

@ViewBuilder
private func miniButton(_ title: String, filled: Bool) -> some View {
Text(title)
.font(.caption)
.foregroundStyle(filled ? ink : .secondary)
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
private func softIcon(systemName: String, tint: Color) -> some View {
Image(systemName: systemName)
.font(.system(size: 13, weight: .medium))
.foregroundStyle(ink.opacity(0.74))
.frame(width: 36, height: 36)
.background(tint.opacity(0.22))
.clipShape(Circle())
}

@ViewBuilder
private func journalModePill(_ title: String) -> some View {
let selected = selectedJournalMode == title

Button {
selectedJournalMode = title
} label: {
Text(title)
.font(.caption)
.foregroundStyle(selected ? ink : .secondary)
.padding(.horizontal, 14)
.padding(.vertical, 8)
.background(selected ? background : Color.clear)
.overlay(
Capsule()
.stroke(selected ? ink.opacity(0.16) : Color.secondary.opacity(0.16), lineWidth: 1)
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
.foregroundStyle(selected ? ink : .secondary)
.padding(.horizontal, 14)
.padding(.vertical, 8)
.background(selected ? surface : Color.clear)
.overlay(
Capsule()
.stroke(selected ? ink.opacity(0.16) : Color.secondary.opacity(0.16), lineWidth: 1)
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
.foregroundStyle(selected ? ink : .secondary)
.padding(.horizontal, 14)
.padding(.vertical, 8)
.background(selected ? surface : Color.clear)
.overlay(
Capsule()
.stroke(selected ? ink.opacity(0.16) : Color.secondary.opacity(0.16), lineWidth: 1)
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
mascotSeal(size: 24)
Text("Carl")
.font(.caption)
.foregroundStyle(.secondary)
}
}

Text(message.text)
.font(.system(size: 16, weight: message.author == .user ? .regular : .light, design: message.author == .carl ? .serif : .default))
.foregroundStyle(message.author == .user ? ink : ink.opacity(0.84))
.lineSpacing(2)
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
.font(.system(size: 19, weight: .light, design: .serif))
.foregroundStyle(ink)

Text(entry.preview)
.font(.system(size: 15))
.foregroundStyle(ink.opacity(0.72))
.lineSpacing(2)
}
}

@ViewBuilder
private func timelineRow(_ item: JourneyItem) -> some View {
HStack(alignment: .top, spacing: 14) {
ZStack {
Circle()
.fill(item.tint.color.opacity(0.22))
.frame(width: 22, height: 22)

Circle()
.fill(item.tint.color)
.frame(width: 8, height: 8)
}
.padding(.top, 14)

featureCard {
HStack {
Text(item.date)
.font(.caption)
.foregroundStyle(.secondary)

Spacer()

chip(item.kind, tint: item.tint.color)
}

Text(item.title)
.font(.system(size: 19, weight: .light, design: .serif))
.foregroundStyle(ink)

Text(item.body)
.font(.system(size: 15))
.foregroundStyle(ink.opacity(0.72))
.lineSpacing(2)
}
}
}

@ViewBuilder
private func reflectionBlock(title: String, body: String, tint: Color, serif: Bool = false) -> some View {
VStack(alignment: .leading, spacing: 8) {
labelRow(title, tone: tint)

Text(body)
.font(.system(size: serif ? 19 : 15, weight: .light, design: serif ? .serif : .default))
.foregroundStyle(ink.opacity(serif ? 0.9 : 0.74))
.lineSpacing(serif ? 4 : 2)
}
}

@ViewBuilder
private func importOption(title: String, subtitle: String, tint: Color) -> some View {
VStack(alignment: .leading, spacing: 6) {
HStack {
Text(title)
.font(.system(size: 18, weight: .light, design: .serif))
.foregroundStyle(ink)

Spacer()

softIcon(systemName: "arrow.down.doc", tint: tint)
}

Text(subtitle)
.font(.system(size: 15))
.foregroundStyle(ink.opacity(0.72))
}
.padding()
.background(background)
.clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
}

@ViewBuilder
private func importedRow(_ item: ImportedItem) -> some View {
VStack(alignment: .leading, spacing: 8) {
HStack {
Text(item.title)
.font(.system(size: 18, weight: .light, design: .serif))
.foregroundStyle(ink)

Spacer()

chip(item.type, tint: item.shared ? sage : sand)
}

Text(item.subtitle)
.font(.system(size: 15))
.foregroundStyle(ink.opacity(0.72))

Text(item.shared ? "Available to Carl" : "Private for now")
.font(.caption)
.foregroundStyle(item.shared ? sage : sand)
}
}

@ViewBuilder
private func mascotSeal(size: CGFloat) -> some View {
ZStack {
Circle()
.fill(sand.opacity(0.96))
.frame(width: size, height: size)

Circle()
.stroke(sage.opacity(0.50), lineWidth: max(1, size * 0.08))
.frame(width: size * 0.92, height: size * 0.92)

Circle()
.stroke(ink.opacity(0.40), lineWidth: max(1, size * 0.035))
.frame(width: size * 0.34, height: size * 0.34)
.offset(x: -size * 0.12, y: -size * 0.03)

Circle()
.stroke(ink.opacity(0.40), lineWidth: max(1, size * 0.035))
.frame(width: size * 0.34, height: size * 0.34)
.offset(x: size * 0.12, y: -size * 0.03)

Rectangle()
.fill(ink.opacity(0.40))
.frame(width: size * 0.12, height: max(1, size * 0.025))
.offset(y: -size * 0.03)

Path { path in
path.move(to: CGPoint(x: size * 0.30, y: size * 0.63))
path.addQuadCurve(
to: CGPoint(x: size * 0.70, y: size * 0.63),
control: CGPoint(x: size * 0.50, y: size * 0.76)
)
}
.stroke(ink.opacity(0.38), lineWidth: max(1, size * 0.04))
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

private struct ChatRequest: Codable {
let userId: String
let message: String
}

private struct ChatResponse: Codable {
let reply: String
let userId: String?
let model: String?
let mode: String?
let risk: String?
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
.lineSpacing(3)

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
