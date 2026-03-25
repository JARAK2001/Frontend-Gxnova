/**
 * Dark mode aware style tokens.
 * Usage: const t = useThemeTokens();
 *        style={{ background: t.cardBg, color: t.textPrimary }}
 */
import { useTheme } from '../context/ThemeContext';

export function useThemeTokens() {
    const { darkMode } = useTheme();

    return {
        darkMode,
        // Backgrounds
        pageBg:      darkMode ? '#0f1117' : '#f8fafc',
        cardBg:      darkMode ? '#1a1d2e' : '#ffffff',
        cardBg2:     darkMode ? '#21253a' : '#f8fafc',
        cardBorder:  darkMode ? 'rgba(255,255,255,0.08)' : '#f1f5f9',
        inputBg:     darkMode ? '#21253a' : '#f8fafc',
        inputBorder: darkMode ? 'rgba(255,255,255,0.12)' : '#e2e8f0',
        panelBg:     darkMode ? 'rgba(26,29,46,0.85)' : 'rgba(255,255,255,0.75)',
        // Text
        textPrimary:   darkMode ? '#f0f4ff' : '#0f172a',
        textSecondary: darkMode ? '#8892b0' : '#64748b',
        textMuted:     darkMode ? '#606888' : '#94a3b8',
        // Tags / badges
        tagBg:         darkMode ? 'rgba(249,115,22,0.15)' : '#fff7ed',
        tagBorder:     darkMode ? 'rgba(249,115,22,0.3)' : '#fed7aa',
        tagColor:      '#f97316',
        // Orange — same in both modes
        orange:        '#f97316',
        orangeDark:    '#ea580c',
        orangeGlow:    '0 8px 20px -4px rgba(249,115,22,0.35)',
        // Green badge
        greenBg:       darkMode ? 'rgba(5,150,105,0.15)' : '#ecfdf5',
        greenColor:    '#059669',
        greenBorder:   darkMode ? 'rgba(5,150,105,0.3)' : '#a7f3d0',
        // Yellow badge
        yellowBg:      darkMode ? 'rgba(202,138,4,0.15)' : '#fefce8',
        yellowColor:   darkMode ? '#fbbf24' : '#ca8a04',
        yellowBorder:  darkMode ? 'rgba(202,138,4,0.3)' : '#fef08a',
        // Shadow
        shadow:        darkMode
            ? '0 10px 30px rgba(0,0,0,0.5)'
            : '0 8px 32px -8px rgba(0,0,0,0.05)',
        shadowCard:    darkMode
            ? '0 4px 20px rgba(0,0,0,0.4)'
            : '0 10px 25px -10px rgba(0,0,0,0.05)',
    };
}
