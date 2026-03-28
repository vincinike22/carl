import SwiftUI

struct CarlScreen<Content: View>: View {
    let title: String
    let subtitle: String
    @ViewBuilder let content: Content

    init(title: String, subtitle: String, @ViewBuilder content: () -> Content) {
        self.title = title
        self.subtitle = subtitle
        self.content = content()
    }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 24) {
                VStack(alignment: .leading, spacing: 14) {
                    Rectangle()
                        .fill(CarlPalette.sage.opacity(0.45))
                        .frame(width: 44, height: 1)

                    Text(title)
                        .font(.system(size: 34, weight: .light, design: .serif))
                        .foregroundStyle(CarlPalette.text)
                        .fixedSize(horizontal: false, vertical: true)

                    Text(subtitle)
                        .font(.system(size: 17, weight: .regular, design: .default))
                        .foregroundStyle(CarlPalette.textMuted)
                        .lineSpacing(5)
                        .fixedSize(horizontal: false, vertical: true)
                }

                content
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 24)
        }
        .background(CarlPalette.background.ignoresSafeArea())
        .scrollIndicators(.hidden)
    }
}

struct CarlCard<Content: View>: View {
    var tint: Color = CarlPalette.surface
    @ViewBuilder let content: Content

    init(tint: Color = CarlPalette.surface, @ViewBuilder content: () -> Content) {
        self.tint = tint
        self.content = content()
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            content
        }
        .padding(18)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(tint)
        )
        .overlay(
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .stroke(CarlPalette.border, lineWidth: 1)
        )
    }
}

struct Pill: View {
    let title: String
    var isSelected: Bool = false

    var body: some View {
        Text(title)
            .font(.system(size: 12, weight: .medium))
            .foregroundStyle(isSelected ? CarlPalette.text : CarlPalette.textMuted)
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                Capsule(style: .continuous)
                    .fill(isSelected ? CarlPalette.background : .clear)
            )
            .overlay(
                Capsule(style: .continuous)
                    .stroke(isSelected ? CarlPalette.text.opacity(0.18) : CarlPalette.border, lineWidth: 1)
            )
    }
}

struct SectionLabel: View {
    let text: String
    let tint: Color

    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 11, weight: .medium))
            .tracking(2)
            .foregroundStyle(tint)
    }
}
