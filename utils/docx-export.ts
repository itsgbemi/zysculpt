
import { 
  Document, 
  Paragraph, 
  TextRun, 
  HeadingLevel, 
  AlignmentType, 
  ExternalHyperlink,
  Packer 
} from 'docx';

export const parseMarkdownToDocx = (content: string): Paragraph[] => {
  const lines = content.split('\n');
  const paragraphs: Paragraph[] = [];

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      return;
    }

    // Header logic
    if (trimmed.startsWith('# ')) {
      paragraphs.push(new Paragraph({
        text: trimmed.slice(2),
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }));
      return;
    }
    if (trimmed.startsWith('## ')) {
      paragraphs.push(new Paragraph({
        text: trimmed.slice(3),
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 120 }
      }));
      return;
    }
    if (trimmed.startsWith('### ')) {
      paragraphs.push(new Paragraph({
        text: trimmed.slice(4),
        heading: HeadingLevel.HEADING_3,
        spacing: { before: 150, after: 100 }
      }));
      return;
    }

    // List logic (Standard Bullets)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      paragraphs.push(new Paragraph({
        children: parseTextWithFormatting(trimmed.slice(2)),
        bullet: { level: 0 },
        spacing: { after: 80 }
      }));
      return;
    }

    // Regular paragraph with potential bolding and links
    paragraphs.push(new Paragraph({
      children: parseTextWithFormatting(line),
      spacing: { after: 120 }
    }));
  });

  return paragraphs;
};

const parseTextWithFormatting = (text: string): (TextRun | ExternalHyperlink)[] => {
  const parts: (TextRun | ExternalHyperlink)[] = [];
  
  // Basic Regex for [text](url)
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    // Text before the link
    if (match.index > lastIndex) {
      parts.push(...parseBold(text.slice(lastIndex, match.index)));
    }
    
    // The link itself
    parts.push(new ExternalHyperlink({
      children: [
        new TextRun({
          text: match[1],
          style: "Hyperlink",
          color: "0000EE",
          underline: {},
        }),
      ],
      link: match[2],
    }));
    
    lastIndex = linkRegex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    parts.push(...parseBold(text.slice(lastIndex)));
  }

  return parts;
};

const parseBold = (text: string): TextRun[] => {
  const boldParts: TextRun[] = [];
  const segments = text.split(/(\*\*.*?\*\*)/g);
  
  segments.forEach(segment => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      boldParts.push(new TextRun({
        text: segment.slice(2, -2),
        bold: true
      }));
    } else if (segment) {
      boldParts.push(new TextRun(segment));
    }
  });

  return boldParts;
};
