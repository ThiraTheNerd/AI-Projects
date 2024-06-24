import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const gemini_api_key = process.env.API_KEY;
const googleAI = new GoogleGenerativeAI(gemini_api_key);
const geminiConfig = {
    temperature: 0.9,
    topP: 1,
    topK: 1,
    maxOutputTokens: 4096,
  };
const geminiModel = googleAI.getGenerativeModel({
model: "gemini-pro",
geminiConfig,
});

// Get elements from the DOM
const open = document.getElementById("open");
const modal_container = document.getElementById("modal_container");
const close = document.getElementById("close");
const respDialog = document.querySelector("dialog");
const message = document.getElementById("message");
const filePicker = document.getElementById("file");
const afterPromptResponse = document.getElementById("gemini-response");
const images = document.getElementById("images");


open.addEventListener("click", async () => {
    try {
      const askGemini = async () => {
        const promptText = document.getElementById("gemini-prompt").value;
  
        const result = await geminiModel.generateContent(promptText);
        const response = result.response;
        const text = response.text();
  
        afterPromptResponse.innerText = text;
      };
      await askGemini();
      modal_container.classList.add("show");
    } catch (error) {
      const message = error?.message ?? "Something went wrong"
      console.warn(message);
      alert(message)
    }
  });

  close.addEventListener("click", () => {
    modal_container.classList.remove("show");
  });

  filePicker.addEventListener("change", async (event) => {
    event.preventDefault();
    try {
      // Converts a File object to a GoogleGenerativeAI.Part object.
      async function fileToGenerativePart(file) {
        const base64EncodedDataPromise = new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result.split(",")[1]);
          reader.readAsDataURL(file);
        });
        return {
          inlineData: {
            data: await base64EncodedDataPromise,
            mimeType: file.type,
          },
        };
      }
  
      const askGemini = async () => {
        // For text-and-images input (multimodal), use the gemini-pro-vision model
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const prompt = "What's different between these pictures?";
  
        const fileInputEl = document.querySelector("input[type=file]");
        const imageParts = await Promise.all(
          [...fileInputEl.files].map(fileToGenerativePart)
        );
  
        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        const text = response.text();
  
        message.innerText = text;
  
        const fileList = [...fileInputEl.files]
  
        fileList.forEach(file => {
          if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
              const el = document.createElement('img')
              el.src = e.target.result
              images.appendChild(el)
            };
            reader.readAsDataURL(file);
          }
        })
      };
      await askGemini();
      respDialog.show();
    } catch (error) {
      const message = error?.message ?? "Something went wrong"
      console.warn(message);
      alert(message)
    }
  });
// const generate = async () => {
//     try {
//       const prompt = "Tell me about google.";
//       const result = await geminiModel.generateContent(prompt);
//       const response = result.response;
//       console.log(response.text());
//     } catch (error) {
//       console.log("response error", error);
//     }
//   };
   
//   generate();