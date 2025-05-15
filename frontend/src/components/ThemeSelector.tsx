import { useTheme } from "./ThemeContext";

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <label style={{ marginRight: "0.5rem" }}>테마 선택:</label>
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as "light" | "black" | "system")}
        style={{ padding: "4px 8px", borderRadius: "4px" }}
      >
        <option value="light">Light</option>
        <option value="black">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
