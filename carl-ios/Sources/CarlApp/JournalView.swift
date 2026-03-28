import SwiftUI

struct JournalView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 18) {
                topBar(title: "Journal", subtitle: store.journalSubtitle) {
                    store.presentInfo(.journal)
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 14) {
                        labelRow("New Entry", tone: .secondary)

                        TextEditor(text: $store.journalDraft)
                            .frame(minHeight: 180)
                            .scrollContentBackground(.hidden)
                            .padding(12)
                            .background(CarlPalette.background)
                            .clipShape(RoundedRectangle(cornerRadius: 20, style: .continuous))
                            .overlay(alignment: .topLeading) {
                                if store.journalDraft.isEmpty {
                                    Text("Write freely.")
                                        .foregroundStyle(.secondary)
                                        .padding(.leading, 18)
                                        .padding(.top, 20)
                                }
                            }

                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(JournalMode.allCases) { mode in
                                    journalModePill(mode.rawValue, selected: store.selectedJournalMode == mode) {
                                        store.selectedJournalMode = mode
                                    }
                                }
                            }
                        }

                        HStack {
                            Button {
                                store.showingImportSheet = true
                            } label: {
                                Text("Import writing")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundStyle(CarlPalette.text)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                                    .background(CarlPalette.sand.opacity(0.24))
                                    .clipShape(Capsule())
                            }

                            Spacer()

                            Button {
                                store.saveJournalEntry()
                            } label: {
                                Text("Save entry")
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundStyle(CarlPalette.text)
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 10)
                                    .background(CarlPalette.lavender.opacity(0.30))
                                    .clipShape(Capsule())
                            }
                        }
                    }
                }

                CarlCard {
                    VStack(alignment: .leading, spacing: 14) {
                        labelRow("Recent", tone: .secondary)

                        ForEach(store.journalEntries) { entry in
                            journalRow(entry)
                            if entry.id != store.journalEntries.last?.id {
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
        .background(CarlPalette.background.ignoresSafeArea())
    }

    @ViewBuilder
    private func topBar(title: String, subtitle: String, infoAction: @escaping () -> Void) -> some View {
        HStack(alignment: .center) {
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(.system(size: 30, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundStyle(.secondary)
            }

            Spacer()

            Button(action: infoAction) {
                Image(systemName: "info.circle")
                    .font(.system(size: 18, weight: .medium))
                    .foregroundStyle(CarlPalette.text.opacity(0.75))
                    .frame(width: 34, height: 34)
                    .background(CarlPalette.elevated)
                    .clipShape(Circle())
            }
            .buttonStyle(.plain)
        }
    }

    @ViewBuilder
    private func labelRow(_ value: String, tone: Color) -> some View {
        Text(value.uppercased())
            .font(.caption)
            .tracking(0.8)
            .foregroundStyle(tone)
    }

    @ViewBuilder
    private func journalModePill(_ title: String, selected: Bool, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(title)
                .font(.caption)
                .foregroundStyle(selected ? CarlPalette.text : .secondary)
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(selected ? CarlPalette.background : Color.clear)
                .overlay(
                    Capsule()
                        .stroke(selected ? CarlPalette.text.opacity(0.16) : Color.secondary.opacity(0.16), lineWidth: 1)
                )
                .clipShape(Capsule())
        }
        .buttonStyle(.plain)
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
                .foregroundStyle(CarlPalette.text)

            Text(entry.preview)
                .font(.system(size: 15))
                .foregroundStyle(CarlPalette.text.opacity(0.72))
                .lineSpacing(2)
        }
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.16))
            .frame(height: 1)
    }

    private func accessTint(for access: String) -> Color {
        switch access {
        case "Shared with Carl":
            return CarlPalette.sage
        case "Attached":
            return CarlPalette.lavender
        default:
            return CarlPalette.sand
        }
    }
}

struct ImportView: View {
    @EnvironmentObject private var store: CarlStore

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 18) {
                    CarlCard {
                        VStack(alignment: .leading, spacing: 12) {
                            labelRow("Import Sources", tone: .secondary)
                            importOption(title: "Notion", subtitle: "Import journals, notes, databases, and long-form reflections", tint: CarlPalette.lavender)
                            importOption(title: "Markdown and text files", subtitle: "Bring folders of .md and .txt writing into Carl", tint: CarlPalette.sage)
                            importOption(title: "Documents", subtitle: "Later: PDFs, rich text, and exported archives", tint: CarlPalette.sand)
                        }
                    }

                    CarlCard {
                        VStack(alignment: .leading, spacing: 14) {
                            labelRow("Imported", tone: .secondary)
                            ForEach(store.importedItems) { item in
                                importedRow(item)
                                if item.id != store.importedItems.last?.id {
                                    divider
                                }
                            }
                        }
                    }
                }
                .padding(20)
                .padding(.bottom, 30)
            }
            .background(CarlPalette.background.ignoresSafeArea())
            .navigationTitle("Import")
        }
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
    private func importOption(title: String, subtitle: String, tint: Color) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                    .font(.system(size: 18, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Spacer()

                Image(systemName: "arrow.down.doc")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundStyle(CarlPalette.text.opacity(0.74))
                    .frame(width: 36, height: 36)
                    .background(tint.opacity(0.22))
                    .clipShape(Circle())
            }

            Text(subtitle)
                .font(.system(size: 15))
                .foregroundStyle(CarlPalette.text.opacity(0.72))
        }
        .padding()
        .background(CarlPalette.background)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
    }

    @ViewBuilder
    private func importedRow(_ item: ImportedItem) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(item.title)
                    .font(.system(size: 18, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Spacer()

                chip(item.type, tint: item.shared ? CarlPalette.sage : CarlPalette.sand)
            }

            Text(item.subtitle)
                .font(.system(size: 15))
                .foregroundStyle(CarlPalette.text.opacity(0.72))

            Text(item.shared ? "Available to Carl" : "Private for now")
                .font(.caption)
                .foregroundStyle(item.shared ? CarlPalette.sage : CarlPalette.sand)
        }
    }

    private var divider: some View {
        Rectangle()
            .fill(Color.secondary.opacity(0.16))
            .frame(height: 1)
    }
}
