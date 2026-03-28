import SwiftUI

struct ReflectionView: View {
    @EnvironmentObject private var store: CarlStore
    @State private var timeframe = 1

    private let options = ["Last 7 days", "Last 30 days", "Since March 1", "Custom range"]

    var body: some View {
        CarlScreen(
            title: "A letter, when the time feels right.",
            subtitle: "Not a weekly report. A reflection letter you can ask for at any time — or allow Carl to gently suggest when enough has accumulated."
        ) {
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 10) {
                    ForEach(Array(options.enumerated()), id: \.offset) { index, title in
                        Button {
                            timeframe = index
                        } label: {
                            Pill(title: title, isSelected: index == timeframe)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }

            CarlCard(tint: CarlPalette.background) {
                SectionLabel(text: "Suggestions", tint: CarlPalette.textMuted.opacity(0.65))
                VStack(alignment: .leading, spacing: 12) {
                    TriggerHint(text: "Ask anytime")
                    TriggerHint(text: "Suggested after enough material")
                    TriggerHint(text: "Offered after a long quiet period")
                    TriggerHint(text: "Can appear after tagged life events")
                }
            }

            CarlCard {
                HStack(spacing: 8) {
                    Circle()
                        .fill(CarlPalette.sage.opacity(0.3))
                        .frame(width: 20, height: 20)
                        .overlay(Circle().fill(CarlPalette.sage.opacity(0.75)).frame(width: 8, height: 8))
                    Text("Reflection Letter")
                        .font(.system(size: 12, weight: .medium))
                        .tracking(1.8)
                        .foregroundStyle(CarlPalette.textMuted.opacity(0.6))
                }

                Text("February 25 – March 27, 2026 · 30 days")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundStyle(CarlPalette.textMuted.opacity(0.42))

                Divider().overlay(CarlPalette.border)

                ForEach(Array(store.reflectionSections.enumerated()), id: \.element.id) { index, section in
                    VStack(alignment: .leading, spacing: 10) {
                        SectionLabel(text: section.title, tint: section.tint)
                        Text(section.body)
                            .font(.system(size: section.title == "A question to sit with" ? 18 : 15, weight: .light, design: section.title == "A question to sit with" ? .serif : .default))
                            .foregroundStyle(CarlPalette.text.opacity(section.title == "A question to sit with" ? 0.88 : 0.74))
                            .italic(section.title == "A question to sit with")
                            .lineSpacing(6)
                    }

                    if index < store.reflectionSections.count - 1 {
                        Divider().overlay(CarlPalette.border)
                    }
                }
            }
        }
        .navigationTitle("Reflection")
    }
}

private struct TriggerHint: View {
    let text: String

    var body: some View {
        HStack(spacing: 10) {
            Circle()
                .fill(CarlPalette.border)
                .frame(width: 5, height: 5)
            Text(text)
                .font(.system(size: 14))
                .foregroundStyle(CarlPalette.textMuted)
        }
    }
}
