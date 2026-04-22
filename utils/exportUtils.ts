import { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType } from 'https://esm.sh/docx';
import { ResumeData, CoverLetterData } from '../types';

export const downloadTXT = (data: ResumeData, filename: string) => {
  let content = `${data.name.toUpperCase()}\n`;
  content += `${data.email} | ${data.phone}\n`;
  content += `${data.linkedin} | ${data.website}\n\n`;
  content += `PROFESSIONAL SUMMARY\n${data.summary}\n\n`;
  content += `WORK EXPERIENCE\n`;
  data.experiences.forEach(exp => {
    content += `${exp.role.toUpperCase()} | ${exp.dates}\n`;
    content += `${exp.company}, ${exp.location}\n`;
    exp.description.forEach(bullet => {
      content += `• ${bullet}\n`;
    });
    content += `\n`;
  });
  content += `EDUCATION\n`;
  data.educations.forEach(edu => {
    content += `${edu.school.toUpperCase()} | ${edu.dates}\n`;
    content += `${edu.degree}${edu.concentration ? ` - ${edu.concentration}` : ''}\n\n`;
  });
  content += `SKILLS\n`;
  data.skills.forEach(s => {
    content += `${s.category}: ${s.items.join(', ')}\n`;
  });
  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.txt`;
  link.click();
};

export const downloadCoverLetterTXT = (data: CoverLetterData, filename: string) => {
  const displayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  let content = `${data.name.toUpperCase()}\n`;
  content += `${data.email} | ${data.phone} | ${data.linkedin}\n\n`;
  content += `${displayDate}\n\n`;
  content += `${data.recipientName}\n${data.recipientTitle}\n${data.companyName}\n${data.companyAddress}\n\n`;
  content += `SUBJECT: ${data.subject}\n\n`;
  content += `${data.salutation}\n\n`;
  data.body.forEach(para => {
    content += `${para}\n\n`;
  });
  content += `${data.closing}\n`;
  content += `${data.name}\n`;

  const blob = new Blob([content], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.txt`;
  link.click();
};

export const downloadCoverLetterDOCX = async (data: CoverLetterData, filename: string, templateType: string) => {
  const font = "Times New Roman";
  const alignment = AlignmentType.CENTER;
  const standardMargin = 1080;

  const displayDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const children: any[] = [
    new Paragraph({
      alignment,
      children: [
        new TextRun({ text: data.name.toUpperCase(), bold: true, size: 48, font, color: "000000" })
      ]
    }),
    new Paragraph({
      alignment,
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" } },
      children: [
        new TextRun({ text: `${data.email} | ${data.phone} | ${data.linkedin}`, size: 20, font, color: "000000" })
      ],
      spacing: { after: 400 }
    }),
    new Paragraph({
      children: [new TextRun({ text: displayDate, size: 21, font })],
      spacing: { before: 200, after: 200 }
    }),
    new Paragraph({
      children: [new TextRun({ text: data.recipientName, bold: true, size: 21, font })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.recipientTitle, size: 21, font })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.companyName, size: 21, font })],
    }),
    new Paragraph({
      children: [new TextRun({ text: data.companyAddress, size: 21, font })],
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [new TextRun({ text: `RE: ${data.subject}`, bold: true, size: 21, font })],
      spacing: { after: 300 }
    }),
    new Paragraph({
      children: [new TextRun({ text: data.salutation, size: 21, font })],
      spacing: { after: 200 }
    }),
  ];

  data.body.forEach(para => {
    children.push(new Paragraph({
      children: [new TextRun({ text: para, size: 21, font })],
      spacing: { after: 200 },
      alignment: AlignmentType.JUSTIFY
    }));
  });

  children.push(new Paragraph({
    children: [new TextRun({ text: `\n${data.closing}`, size: 21, font })],
    spacing: { before: 400 }
  }));

  children.push(new Paragraph({
    children: [new TextRun({ text: data.name, bold: true, size: 21, font })],
    spacing: { before: 200 }
  }));

  const doc = new Document({
    sections: [{
      properties: { 
        page: { margin: { top: standardMargin, right: standardMargin, bottom: standardMargin, left: standardMargin } } 
      },
      children
    }]
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.docx`;
  link.click();
};

export const downloadDOCX = async (data: ResumeData, filename: string, templateType: string) => {
  const sections: any[] = [];
  const standardMargin = 1080;
  const rightTabPosition = 9350;
  const font = "Times New Roman";

  const children: any[] = [
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: data.name.toUpperCase(), bold: true, size: 48, font, color: "000000" })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({ text: `${data.email}, ${data.phone}, ${data.linkedin}`, size: 20, font, color: "000000" })
      ],
      spacing: { after: 200 }
    }),
  ];

  const createHeader = (title: string) => new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" } },
    spacing: { before: 250, after: 120 },
    children: [
      new TextRun({ text: title.toUpperCase(), bold: true, size: 22, font, color: "000000" })
    ]
  });

  children.push(createHeader("Professional Summary"));
  children.push(new Paragraph({ text: data.summary, size: 21, font, color: "000000" }));

  children.push(createHeader("Work Experience"));
  data.experiences.forEach(exp => {
    children.push(new Paragraph({
      spacing: { before: 180 },
      children: [
        new TextRun({ text: exp.role, bold: true, size: 22, font, color: "000000" })
      ]
    }));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: exp.dates, bold: true, size: 18, font, color: "666666" })
      ]
    }));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: `${exp.company}, ${exp.location}`, italic: true, size: 20, font, color: "000000" })
      ],
      spacing: { after: 100 }
    }));
    exp.description.forEach(d => {
      children.push(new Paragraph({
        text: d,
        bullet: { level: 0 },
        size: 21,
        font,
        color: "000000",
        spacing: { before: 40 }
      }));
    });
  });

  children.push(createHeader("Education"));
  data.educations.forEach(edu => {
    children.push(new Paragraph({
      spacing: { before: 150 },
      children: [
        new TextRun({ text: edu.school, bold: true, size: 22, font, color: "000000" })
      ]
    }));
    children.push(new Paragraph({
      children: [
        new TextRun({ text: edu.dates, size: 18, font, color: "666666" })
      ]
    }));
    children.push(new Paragraph({
      text: `${edu.degree}${edu.concentration ? `, ${edu.concentration}` : ''}`,
      size: 21,
      font,
      color: "000000"
    }));
  });

  children.push(createHeader("Skills"));
  data.skills.forEach(s => {
    children.push(new Paragraph({
      spacing: { before: 40 },
      children: [
        new TextRun({ text: `${s.category}: `, bold: true, size: 21, font, color: "000000" }),
        new TextRun({ text: s.items.join(', '), size: 21, font, color: "000000" })
      ]
    }));
  });

  sections.push({ 
    properties: { page: { margin: { top: standardMargin, right: standardMargin, bottom: standardMargin, left: standardMargin } } }, 
    children 
  });

  const doc = new Document({ sections });
  const blob = await Packer.toBlob(doc);
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.docx`;
  link.click();
};