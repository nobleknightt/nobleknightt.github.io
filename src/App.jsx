import { useEffect, useState } from "react"
import icon from "./assets/icon.png"

function App() {

  const techStack = ["Python", "JavaScript", "React", "FastAPI", "Tailwind CSS", "Golang", "Linux", "Bash", "Web Scraping", "Django", "Git", "Github", "Docker", "C++", "MySQL", "PostgreSQL", "MongoDB", "Algorithms", "Data Structures"]
  const subHeadings = ["Python Developer", "JavaScript Developer", "React Developer", "Django Developer", "Linux Enthusiast", "Learning Golang"]

  const projects = [
    {
      title: "Contests Web App",
      description: "A Progressive Web App which shows upcoming and ongoing contests from AtCoder, CodeChef, Codeforces, GeeksforGeeks and LeetCode",
      techstack: ["React", "Tailwind CSS", "Python", "Web Scraping"],
      url: "https://nobleknightt.github.io/contests",
      github: "https://github.com/nobleknightt/contests"
    },
    {
      title: "Web Search for ChatGPT",
      description: "Browser extension which updates ChatGPT on latest events using Google, based on RAG (Retrieval Augmented Generation)",
      techstack: ["JavaScript", "SerpAPI"],
      github: "https://github.com/nobleknightt/web-search-for-chatgpt"
    }
  ]

  const [showMenu, setShowMenu] = useState(false)
  const [subHeading, setSubHeading] = useState("")

  function subHeadingWriter(i, j) {
    setSubHeading(subHeadings[i].slice(0, j + 1))
    if (j == (subHeadings[i].length - 1)) {
      setTimeout(() => subHeadingWriter((i + 1) % subHeadings.length, 0), 1000)
    } else {
      setTimeout(() => subHeadingWriter(i, j + 1), 250)
    }
  }

  useEffect(() => {
    subHeadingWriter(0, 0)
  }, [])


  return (
    <div className="flex flex-col font-['Bricolage_Grotesque'] p-2 h-screen">
      <div className="flex justify-between mx-2 px-2 md:px-4 pb-2 border-b">
        <div className="flex items-center justify-center hover:animate-spin">
          <img src={icon} width={23} height={24}></img>
        </div>
        <div className="hidden sm:flex gap-8 justify-center items-center text-xl tracking-tighter">
          <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950 hover:cursor-pointer" onClick={() => {
            document.getElementById("about").scrollIntoView({ behavior: "smooth" })
          }}>About</div>
          <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950 hover:cursor-pointer" onClick={() => {
            document.getElementById("projects").scrollIntoView({ behavior: "smooth" })
          }}>Projects</div>
          <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950">
            <a href="https://nobleknight.hashnode.dev" target="_blank">Blog</a>
          </div>
        </div>
        <div className="flex sm:hidden justify-center items-center text-xl tracking-tighter relative">
          <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950 border px-2 hover:border-gray-950" onClick={() => setShowMenu(!showMenu)}>Menu</div>
          <div className={`${showMenu ? "flex" : "hidden"} flex-col gap-1 absolute top-10 right-0 border bg-white px-4 py-2`}>
            <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950 hover:cursor-pointer" onClick={() => {
              document.getElementById("about").scrollIntoView({ behavior: "smooth" })
            }}>About</div>
            <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950 hover:cursor-pointer" onClick={() => {
              document.getElementById("projects").scrollIntoView({ behavior: "smooth" })
            }}>Projects</div>
            <div className="underline decoration-1 decoration-gray-200 hover:decoration-gray-950">
              <a href="https://nobleknight.hashnode.dev" target="_blank">Blog</a>
            </div>
          </div>
        </div>
      </div>
      <div className="grow overflow-scroll">
        <div className="h-full flex flex-col items-center justify-center gap-6 md:gap-8 border-b">
          <div className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl tracking-tighter text-center">Ajay Dandge</div>
          <div className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl px-2 md:px-3 md:py-1 tracking-tighter">{subHeading}&nbsp;<span>_</span></div>
        </div>
        <div className="h-full p-4 border-b flex items-center justify-center">
          <div className="grid grid-cols-2 min-[425px]:grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {
              techStack.map(
                (value, index) => <div key={`stack-${index.toString().padStart(2, '0')}`} className="border px-2 py-1 text-center tracking-tighter sm:text-xl lg:text-2xl xl:text-3xl hover:border-gray-950">{value}</div>
              )
            }
          </div>
        </div>
        <div id="about" className="h-full p-4 md:p-16 lg:p-32 xl:p-64 border-b flex flex-col gap-4 justify-center">
          <p className="md:text-xl tracking-tight">
            I am a Fullstack Developer, with passion for learning new things.
            <br /><span className="font-medium">Polyglot Programmer:</span> Python, JavaScript, C++, Java, Golang, SQL (and always hungry to learn more!)
            <br /><span className="font-medium">Algorithm Ninja:</span> I love tackling challenging data structures and algorithmic problems.
            <br /><span className="font-medium">DevOps Do-It-All:</span> Docker, Linux, Bash - my toolkit keeps deployments smooth.
            <br /><span className="font-medium">Tech-Savvy:</span> React, Django, TailwindCSS, MongoDB, Git, GitHub - you name it, I've likely wrestled with it.
          </p>
          <div className="flex gap-2">
            <a className="border px-2 py-0 underline decoration-1 decoration-gray-200 hover:border-gray-950 hover:decoration-gray-950 tracking-tighter md:text-lg" href="https://www.linkedin.com/in/ajaydandge" target="_blank">LinkedIn</a>
            <a className="border px-2 py-0 underline decoration-1 decoration-gray-200 hover:border-gray-950 hover:decoration-gray-950 tracking-tighter md:text-lg" href="https://leetcode.com/nobleknight" target="_blank">LeetCode</a>
          </div>
        </div>
        <div id="projects" className="h-full p-4 md:p-8 border-b flex flex-col lg:flex-row gap-4 items-center justify-center">
          {
            projects.map((value) =>
              <div key={`project-${value.title.toLowerCase().split(" ").join("-")}`} className="w-full border flex flex-col gap-1 p-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <a className="text-2xl underline decoration-1 decoration-gray-200 hover:border-gray-950 hover:decoration-gray-950 hover:cursor-pointer tracking-tighter" href={`${Object.keys(value).includes("url") ? value.url : value.github}`} target="_blank">
                    {value.title}
                  </a>
                  <a className="border px-1 py-0 tracking-tighter underline decoration-1 decoration-gray-200 hover:border-gray-950 hover:decoration-gray-950" href={value.github} target="_blank">GitHub</a>
                </div>
                <div className="tracking-tighter">{value.description}</div>
                <div className="flex gap-2 flex-wrap">
                  {
                    value.techstack.map((value) =>
                      <div className="px-2 border tracking-tighter">{value}</div>
                    )
                  }
                </div>
              </div>
            )
          }
        </div>
        <div className="flex items-center justify-center">
          <footer className="tracking-tighter">&copy; 2024 Ajay Dandge. All rights reserved.</footer>
        </div>
      </div>
    </div>
  )
}

export default App
