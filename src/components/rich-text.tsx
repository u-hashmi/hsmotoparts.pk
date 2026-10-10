/**
 * Renders simple formatted text written in the admin panel:
 * blank line = new paragraph, "## " = heading, lines starting with "- " = bullet list.
 */
export function RichText({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/);
  return (
    <div className="prose-shop">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) return <h2 key={i}>{block.slice(3)}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => l.startsWith("- "))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => <li key={j}>{l.slice(2)}</li>)}
            </ul>
          );
        }
        return <p key={i} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}
