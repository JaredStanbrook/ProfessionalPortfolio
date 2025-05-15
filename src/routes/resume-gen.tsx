import { createFileRoute, Link } from "@tanstack/react-router";

import React, { useState, useEffect } from "react";
import { unified } from "unified";
import remarkParse from "remark-parse";
import rehypeSanitize from "rehype-sanitize";
import rehypeReact from "rehype-react";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import { VFile } from "vfile";
import { Remark } from "react-remark";

export const Route = createFileRoute("/resume-gen")({
  component: ResumeGenerator,
});

const CodeBlock = ({ className, children }) => {
  const language = className ? className.replace("language-", "") : "";

  return (
    <div className="custom-code-block">
      {language && <div className="code-language">{language}</div>}
      <pre className={className}>
        <code>{children}</code>
      </pre>
    </div>
  );
};

// Custom component for callouts/notes
const Callout = ({ children, type = "info" }) => {
  return (
    <div className={`callout callout-${type}`}>
      {type === "info" && (
        <span role="img" aria-label="info">
          ℹ️
        </span>
      )}
      {type === "warning" && (
        <span role="img" aria-label="warning">
          ⚠️
        </span>
      )}
      {type === "success" && (
        <span role="img" aria-label="success">
          ✅
        </span>
      )}
      <div className="callout-content">{children}</div>
    </div>
  );
};
const rawMarkdown = `# Jared Stanbrook
📧 jared.stanbrook@outlook.com | 📞 (+61) 418 407 644  
🌐 [jaredstanbrook.com](http://jaredstanbrook.com) | 💻 [GitHub](https://github.com/JaredStanbrook)
---
## FRONT-END SOFTWARE ENGINEER | React | TypeScript | IoT Visualization
Energetic junior front-end engineer with strong foundations in JavaScript, React, and UI/UX principles. Passionate about building modern, responsive, and accessible web interfaces for real-world applications. Experienced with cross-functional teams and agile workflows. Seeking to contribute to cutting-edge IoT and automation systems at Element Engineering.
---
### 🧠 TECHNICAL SKILLS
- **Languages:** JavaScript (ES6+), TypeScript, HTML, CSS, Python, C#
- **Frameworks/Libraries:** React.js, Django, Node.js, Express, Tailwind CSS
- **Tools:** Git, Docker, VS Code Dev Containers, Cloudflare Pages/D1, GitHub
- **Methodologies:** Agile (Scrum), SDLC, DevOps Practices
- **Platforms:** Windows, Linux, MacOS, Azure, Google Cloud
---
### 💼 EXPERIENCE
**Web Developer**  
*Envenge Group | Feb 2025 – Jun 2025*  
Developed Greenova, a Django-based environmental compliance web platform.
- Built modular, accessible front-end components using HTML/CSS and Django templates  
- Implemented Dockerized development environment with consistent deployment pipelines  
- Created interfaces for task tracking, document upload, and team workflows  
- **→ Result:** Enabled 30% faster compliance audits with streamlined dashboard UIs
**Help Desk Technician**  
*Murdoch University IT Service Desk | Aug 2024 – Nov 2024*  
Provided technical support to students across devices, systems, and accounts.
- Resolved over 100+ technical issues involving connectivity, printing, and logins  
- Built internal static portal using TypeScript + Cloudflare D1 for staff notes & feedback  
- **→ Result:** Reduced staff handling time by 40% via new logging system
**Disability Support Worker**  
*Independent | Jan 2023 – Aug 2024*  
Worked with NDIS clients to support rehabilitation goals.
- Developed strong interpersonal and client communication skills  
- Learned to document sessions and manage caseloads using digital tools
---
### 🧪 PROJECTS
**🖥Greenova Platform**  
*React UI prototype planned (WIP): GitHub repo coming soon*  
IoT-inspired web dashboard for compliance tracking
- Modular interface mockups created for real-time data tracking  
- Focus on responsive layouts and accessible components (ARIA best practices)  
- Collaboration with backend engineers to integrate Django REST API endpoints
**📊 Student IT Feedback Portal**  
*TypeScript + Cloudflare D1 | Aug–Nov 2024*
- Built responsive form-based UI for staff issue logging  
- Integrated secure data storage via Cloudflare D1  
- Improved internal processes and ensured accessibility compliance (WCAG)
---
### 🎓 EDUCATION & CERTIFICATIONS
**Bachelor of Information Technology** *(In Progress)*  
*Murdoch University | Major: Cyber Security and Forensics*  
- Member: Murdoch Programming Club, IT Society  
- Certificate: Microsoft SC-900 – Security & Identity Fundamentals
**Mazenod College**  
- Computer Club Member | Graduated: 2019
---
### 📁 PORTFOLIO
- GitHub: [github.com/JaredStanbrook](https://github.com/JaredStanbrook)  
- Personal site: [jaredstanbrook.com](http://jaredstanbrook.com)  
- (Provide links to your projects with brief context for each in your application)
---
### 📞 REFERENCES
Paul Redman – Lecturer, Murdoch University — 0417 984 192 — paul.redman@murdoch.edu.au  
Stephan Woodtli – Senior Geologist, Liatam Mining — 0422 509 401 — woodti85@gmail.com  
Megan Cole – Associate Lecturer — m.cole@murdoch.edu.au`;
function ResumeGenerator() {
  const [markdown, setMarkdown] = useState(rawMarkdown);

  // Define custom components to use with remark
  const remarkComponents = {
    code: CodeBlock,
    Callout: Callout,
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Resume Generator</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Input Your Resume Markdown</h2>
            <textarea
              className="w-full h-96 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your markdown resume here..."
              rows={15}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="w-full max-w-[210mm] mx-auto bg-white print:absolute print:left-0 print:top-0">
              {/* Resume Preview */}
              <div className="m-0 p-0 w-full">
                <div className="w-full max-w-[210mm] mx-auto bg-white p-4 print:p-0 print:shadow-none">
                  <div className="prose prose-neutral max-w-none">
                    <Remark
                      rehypeReactOptions={{
                        components: {
                          p: (props) => <p className="custom-paragraph" {...props} />,
                        },
                      }}>
                      {markdown}
                    </Remark>
                    ;
                  </div>
                  {/* Print button */}
                  <div className="flex justify-center my-6 print:hidden">
                    <button
                      onClick={() => window.print()}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors duration-200">
                      Print Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
