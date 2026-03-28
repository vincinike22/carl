import SwiftUI

struct MemoryPreferencesView: View {
    @EnvironmentObject private var store: CarlStore
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 18) {
                Text("Memory")
                    .font(.system(size: 30, weight: .light, design: .serif))
                    .foregroundStyle(CarlPalette.text)

                Text("Choose how Carl remembers")
                    .font(.system(size: 13))
                    .foregroundStyle(.secondary)

                VStack(spacing: 14) {
                    ForEach(MemoryAccessMode.allCases) { mode in
                        Button {
                            store.memoryAccessMode = mode
                        } label: {
                            HStack(alignment: .top, spacing: 14) {
                                Image(systemName: store.memoryAccessMode == mode ? "checkmark.circle.fill" : "circle")
                                    .foregroundStyle(store.memoryAccessMode == mode ? CarlPalette.sage : CarlPalette.text.opacity(0.25))
                                    .font(.system(size: 20))

                                VStack(alignment: .leading, spacing: 6) {
                                    Text(mode.rawValue)
                                        .font(.system(size: 17, weight: .medium))
                                        .foregroundStyle(CarlPalette.text)

                                    Text(mode.description)
                                        .font(.system(size: 14))
                                        .foregroundStyle(.secondary)
                                        .lineSpacing(4)
                                }
                                Spacer()
                            }
                            .padding(18)
                            .background(
                                RoundedRectangle(cornerRadius: 22, style: .continuous)
                                    .fill(CarlPalette.surface)
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
                            .foregroundStyle(.secondary)
                    }
                }
                .tint(CarlPalette.sage)

                Spacer()
            }
            .padding(24)
            .toolbar {
                ToolbarItem {
                    Button("Done") { dismiss() }
                }
            }
            .background(CarlPalette.background.ignoresSafeArea())
        }
    }
}
