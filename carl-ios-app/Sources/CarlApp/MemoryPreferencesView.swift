import SwiftUI

struct MemoryPreferencesView: View {
    @EnvironmentObject private var store: CarlStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            CarlScreen(
                title: "Choose how Carl remembers.",
                subtitle: "You decide the posture first. Carl can feel deeply aware without becoming invasive. These preferences can always be changed later."
            ) {
                VStack(spacing: 14) {
                    ForEach(MemoryAccessMode.allCases) { mode in
                        Button {
                            store.memoryAccessMode = mode
                        } label: {
                            HStack(alignment: .top, spacing: 14) {
                                Image(systemName: store.memoryAccessMode == mode ? "checkmark.circle.fill" : "circle")
                                    .foregroundStyle(store.memoryAccessMode == mode ? CarlPalette.sage : CarlPalette.textMuted.opacity(0.35))
                                    .font(.system(size: 20))
                                VStack(alignment: .leading, spacing: 6) {
                                    Text(mode.rawValue)
                                        .font(.system(size: 17, weight: .medium))
                                        .foregroundStyle(CarlPalette.text)
                                    Text(mode.description)
                                        .font(.system(size: 14))
                                        .foregroundStyle(CarlPalette.textMuted)
                                        .lineSpacing(4)
                                }
                                Spacer()
                            }
                            .padding(18)
                            .background(
                                RoundedRectangle(cornerRadius: 22, style: .continuous)
                                    .fill(CarlPalette.surface)
                            )
                            .overlay(
                                RoundedRectangle(cornerRadius: 22, style: .continuous)
                                    .stroke(store.memoryAccessMode == mode ? CarlPalette.sage.opacity(0.5) : CarlPalette.border, lineWidth: 1)
                            )
                        }
                        .buttonStyle(.plain)
                    }
                }

                Toggle(isOn: $store.reflectionAutomationEnabled) {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("Allow gentle reflection suggestions")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundStyle(CarlPalette.text)
                        Text("Carl may suggest a reflection letter after enough material, after life events, or after a long quiet period.")
                            .font(.system(size: 14))
                            .foregroundStyle(CarlPalette.textMuted)
                    }
                }
                .tint(CarlPalette.sage)
                .padding(18)
                .background(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .fill(CarlPalette.background)
                )
                .overlay(
                    RoundedRectangle(cornerRadius: 22, style: .continuous)
                        .stroke(CarlPalette.border, lineWidth: 1)
                )
            }
            .toolbar {
                ToolbarItem {
                    Button("Done") { dismiss() }
                        .foregroundStyle(CarlPalette.text)
                }
            }
        }
    }
}
