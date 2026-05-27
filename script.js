// Generate Resume

document
  .getElementById("generateBtn")
  .addEventListener("click", async function () {

    const apiKey = document
      .getElementById("apikey")
      .value
      .trim();

    const resumeType = document
      .getElementById("resumeType")
      .value;

    const personalInfo = document
      .getElementById("personalInfo")
      .value;

    const education = document
      .getElementById("education")
      .value;

    const experience = document
      .getElementById("experience")
      .value;

    const projects = document
      .getElementById("projects")
      .value;

    const skills = document
      .getElementById("skills")
      .value;

    const extracurricular = document
      .getElementById("extracurricular")
      .value;

    // Validation

    if (!apiKey) {
      alert("Please enter your Gemini API key");
      return;
    }

    if (
      !personalInfo ||
      !education ||
      !experience ||
      !skills
    ) {
      alert(
        "Please fill Personal Information, Education, Experience and Skills"
      );
      return;
    }

    // Loading

    document
      .getElementById("loading")
      .classList.add("active");

    this.disabled = true;

    // Prompt

    const prompt = `
Create a professional ATS-friendly resume in HTML format.

Resume Type:
${resumeType}

Personal Information:
${personalInfo}

Education:
${education}

Experience:
${experience}

Projects:
${projects}

Skills:
${skills}

Extra Curricular:
${extracurricular}

IMPORTANT:
1. Return ONLY HTML
2. No markdown
3. No \`\`\`
4. Professional formatting
5. Use proper resume sections
`;

    try {

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-goog-api-key": apiKey,
          },

          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (!response.ok) {

        const errorData = await response.json();

        throw new Error(
          errorData.error?.message || "API Request Failed"
        );
      }

      const data = await response.json();

      const resumeHTML =
        data.candidates[0].content.parts[0].text;

      // Clean Response

      const cleanHTML = resumeHTML
        .replace(/```html/g, "")
        .replace(/```/g, "");

      // Show Resume

      document.getElementById(
        "resumePreview"
      ).innerHTML = cleanHTML;

    }

    catch (error) {

      console.error(error);

      alert(
        "Error generating resume:\n" + error.message
      );
    }

    finally {

      document
        .getElementById("loading")
        .classList.remove("active");

      this.disabled = false;
    }

  });

// Download PDF

document
  .getElementById("downloadBtn")
  .addEventListener("click", function () {

    window.print();

  });

// Copy HTML

document
  .getElementById("copyBtn")
  .addEventListener("click", function () {

    const content = document
      .getElementById("resumePreview")
      .innerHTML;

    navigator.clipboard.writeText(content);

    alert("HTML copied successfully!");

  });