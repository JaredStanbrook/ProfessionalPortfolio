import { createFileRoute } from "@tanstack/react-router";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardItem,
  CardImage,
} from "@/components/ui/customcard";

export const Route = createFileRoute("/about")({
  component: Homepage,
});

function Homepage() {
  return (
    <>
      <div className="lg:flex lg:justify-between lg:gap-4 text-muted-foreground">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              <a href="/navigation">Jared Stanbrook</a>
            </h1>
            <h2 className="mt-3 text-lg font-medium tracking-tight text-foreground sm:text-xl">
              IT Student
            </h2>
            <p className="mt-4 max-w-xs leading-normal">Perth, Western Australia</p>
            <p className="mt-4 max-w-xs leading-normal">jared.stanbrook@outlook.com</p>
            <nav className="nav hidden lg:block" aria-label="In-page jump links">
              <ul className="mt-16 w-max">
                <li>
                  <a className="group flex items-center py-3 active" href="#about">
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      About
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#experience">
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      Experience
                    </span>
                  </a>
                </li>
                <li>
                  <a className="group flex items-center py-3" href="#projects">
                    <span className="nav-indicator mr-4 h-px w-8 bg-muted-foreground transition-all group-hover:w-16 group-hover:bg-foregound group-focus-visible:w-16 group-focus-visible:bg-foregound motion-reduce:transition-none"></span>
                    <span className="nav-text text-xs font-bold uppercase tracking-widest group-hover:text-foreground group-focus-visible:text-foreground">
                      Projects
                    </span>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <ul className="ml-1 mt-8 flex items-center" aria-label="Social media">
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://github.com/JaredStanbrook"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub (opens in a new tab)"
                title="GitHub">
                <span className="sr-only">GitHub</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://www.linkedin.com/in/jaredstanbrook/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn (opens in a new tab)"
                title="LinkedIn">
                <span className="sr-only">LinkedIn</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true">
                  <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"></path>
                </svg>
              </a>
            </li>
            <li className="mr-5 text-xs shrink-0">
              <a
                className="block hover:text-foreground"
                href="https://youtube.com/@JaredStanbrook"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Youtube (opens in a new tab)"
                title="CodePen">
                <span className="sr-only">Youtube</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 310 310"
                  fill="currentColor"
                  className="h-6 w-6"
                  aria-hidden="true">
                  <path d="M297.917,64.645c-11.19-13.302-31.85-18.728-71.306-18.728H83.386c-40.359,0-61.369,5.776-72.517,19.938 C0,79.663,0,100.008,0,128.166v53.669c0,54.551,12.896,82.248,83.386,82.248h143.226c34.216,0,53.176-4.788,65.442-16.527 C304.633,235.518,310,215.863,310,181.835v-53.669C310,98.471,309.159,78.006,297.917,64.645z M199.021,162.41l-65.038,33.991 c-1.454,0.76-3.044,1.137-4.632,1.137c-1.798,0-3.592-0.484-5.181-1.446c-2.992-1.813-4.819-5.056-4.819-8.554v-67.764 c0-3.492,1.822-6.732,4.808-8.546c2.987-1.814,6.702-1.938,9.801-0.328l65.038,33.772c3.309,1.718,5.387,5.134,5.392,8.861 C204.394,157.263,202.325,160.684,199.021,162.41z"></path>
                </svg>
              </a>
            </li>
            {/*
                        <li className="mr-5 text-xs shrink-0">
                            <a
                                className="block hover:text-foreground"
                                href="https://codepen.io/bchiang7"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="CodePen (opens in a new tab)"
                                title="CodePen">
                                <span className="sr-only">CodePen</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 64 64"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    className="h-6 w-6"
                                    aria-hidden="true">
                                    <path
                                        d="M3.06 41.732L32 60.932l28.94-19.2V22.268L32 3.068l-28.94 19.2zm57.878 0L32 22.268 3.06 41.732m0-19.463L32 41.47l28.94-19.2M32 3.068v19.2m0 19.463v19.2"
                                        stroke-width="5"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="mr-5 text-xs shrink-0">
                            <a
                                className="block hover:text-foreground"
                                href="https://instagram.com/bchiang7"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="Instagram (opens in a new tab)"
                                title="Instagram">
                                <span className="sr-only">Instagram</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1000 1000"
                                    fill="currentColor"
                                    className="h-6 w-6"
                                    aria-hidden="true">
                                    <path d="M295.42,6c-53.2,2.51-89.53,11-121.29,23.48-32.87,12.81-60.73,30-88.45,57.82S40.89,143,28.17,175.92c-12.31,31.83-20.65,68.19-23,121.42S2.3,367.68,2.56,503.46,3.42,656.26,6,709.6c2.54,53.19,11,89.51,23.48,121.28,12.83,32.87,30,60.72,57.83,88.45S143,964.09,176,976.83c31.8,12.29,68.17,20.67,121.39,23s70.35,2.87,206.09,2.61,152.83-.86,206.16-3.39S799.1,988,830.88,975.58c32.87-12.86,60.74-30,88.45-57.84S964.1,862,976.81,829.06c12.32-31.8,20.69-68.17,23-121.35,2.33-53.37,2.88-70.41,2.62-206.17s-.87-152.78-3.4-206.1-11-89.53-23.47-121.32c-12.85-32.87-30-60.7-57.82-88.45S862,40.87,829.07,28.19c-31.82-12.31-68.17-20.7-121.39-23S637.33,2.3,501.54,2.56,348.75,3.4,295.42,6m5.84,903.88c-48.75-2.12-75.22-10.22-92.86-17-23.36-9-40-19.88-57.58-37.29s-28.38-34.11-37.5-57.42c-6.85-17.64-15.1-44.08-17.38-92.83-2.48-52.69-3-68.51-3.29-202s.22-149.29,2.53-202c2.08-48.71,10.23-75.21,17-92.84,9-23.39,19.84-40,37.29-57.57s34.1-28.39,57.43-37.51c17.62-6.88,44.06-15.06,92.79-17.38,52.73-2.5,68.53-3,202-3.29s149.31.21,202.06,2.53c48.71,2.12,75.22,10.19,92.83,17,23.37,9,40,19.81,57.57,37.29s28.4,34.07,37.52,57.45c6.89,17.57,15.07,44,17.37,92.76,2.51,52.73,3.08,68.54,3.32,202s-.23,149.31-2.54,202c-2.13,48.75-10.21,75.23-17,92.89-9,23.35-19.85,40-37.31,57.56s-34.09,28.38-57.43,37.5c-17.6,6.87-44.07,15.07-92.76,17.39-52.73,2.48-68.53,3-202.05,3.29s-149.27-.25-202-2.53m407.6-674.61a60,60,0,1,0,59.88-60.1,60,60,0,0,0-59.88,60.1M245.77,503c.28,141.8,115.44,256.49,257.21,256.22S759.52,643.8,759.25,502,643.79,245.48,502,245.76,245.5,361.22,245.77,503m90.06-.18a166.67,166.67,0,1,1,167,166.34,166.65,166.65,0,0,1-167-166.34"></path>
                                </svg>
                            </a>
                        </li>
                        <li className="mr-5 text-xs shrink-0">
                            <a
                                className="block hover:text-foreground"
                                href="https://twitter.com/bchiang7"
                                target="_blank"
                                rel="noreferrer noopener"
                                aria-label="Twitter (opens in a new tab)"
                                title="Twitter">
                                <span className="sr-only">Twitter</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 1200 1227"
                                    fill="none"
                                    className="h-5 w-5"
                                    aria-hidden="true">
                                    <path
                                        d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
                                        fill="currentColor"></path>
                                </svg>
                            </a>
                        </li>
                        */}
          </ul>
        </header>
        <main id="content" className="pt-24 lg:w-1/2 lg:py-24 text-muted-foreground">
          <section
            id="about"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="About me">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                About
              </h2>
            </div>
            <div>
              <p className="mb-4 font-bold">Welcome to my website!</p>
              <p className="mb-4">
                For as long as I can remember, I've been deeply immersed in the world of computing,
                driven by a profound curiosity for its technical intricacies.
              </p>
              <p className="mb-4">
                My journey began with Python coding, sparking a passion that led me to explore
                various programming languages and delve into domains like game development, web
                development, and data analysis throughout high school.
              </p>
              <p>
                Now, with a university degree shaping my focus on networking and security, my
                interests have converged on web development, where I continue to deepen my knowledge
                and skills.
              </p>
            </div>
          </section>
          <section
            id="experience"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Work experience">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-white/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Experience
              </h2>
            </div>
            <div>
              <ol className="group/list">
                <li className="mb-12">
                  <Card>
                    <CardHeader>Feb — Jun 2025</CardHeader>
                    <CardContent>
                      <CardTitle href="/">Web Developer – Envenge Group</CardTitle>
                      <CardDescription>
                        Built a Django-based web application for monitoring environmental compliance
                        and project obligations. Contributed to backend logic, user role management,
                        and documentation workflows in a rapid development team setting. Used Docker
                        and VS Code dev containers for a consistent development environment.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Django</CardItem>
                        <CardItem>Docker</CardItem>
                        <CardItem>Backend Development</CardItem>
                        <CardItem>Team Collaboration</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Aug — Nov 2024</CardHeader>
                    <CardContent>
                      <CardTitle href="/it-help-desk">
                        Student IT Service Desk – Murdoch University
                      </CardTitle>
                      <CardDescription>
                        As a part of my studies, I completed workplace learning, providing IT
                        support for students, spending shifts in the Murdoch library assisting
                        students with various technical issues, including printing to the library
                        printers, installing software, connectivity issues with various devices, and
                        account support.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Customer Service</CardItem>
                        <CardItem>Communication</CardItem>
                        <CardItem>Troubleshooting</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Jan 2023 — Aug 2024</CardHeader>
                    <CardContent>
                      <CardTitle href="/">Independent | Disability Support Worker</CardTitle>
                      <CardDescription>
                        I’ve been working as a disability support worker for over a year. It’s been
                        a humbling change of pace to my usual occupation within warehousing;
                        communicating and engaging with clients who access the NDIS and supporting
                        them in reaching their rehabilitation goals have been a rewarding
                        experience, cultivating my development of essential business skills.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Communication</CardItem>
                        <CardItem>Compassion</CardItem>
                        <CardItem>Problem-solving</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>Apr — Jun 2022</CardHeader>
                    <CardContent>
                      <CardTitle href="/">Geological Field Technician | Driller — Sahara</CardTitle>
                      <CardDescription>
                        During my 3-month contract at Sahara, our team efficiently delegated tasks
                        to meet KPIs while collectively managing the drill rig. My responsibilities
                        included precise data entry for geological sampling, operating the drill
                        rig, and setting up an Excel spreadsheet to record data. I utilized advanced
                        Excel formulas to ensure data accuracy and integrity.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Safety</CardItem>
                        <CardItem>Adaptability</CardItem>
                        <CardItem>Analytical</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardHeader>2021 — Dec 2023 </CardHeader>
                    <CardContent>
                      <CardTitle href="/">
                        Forklift Driver | Inbound & Outbound Officer | Production Line — Jasol
                      </CardTitle>
                      <CardDescription>
                        During my two-year tenure at Jasol, I started by supporting order
                        fulfillment and relieving pressure on warehouse officers during busy
                        periods. Gradually, I transitioned to a more hands-on role in chemical
                        pumping on the production line and took on additional responsibilities in
                        product distribution. Although my technical skills weren't directly
                        utilized, I leveraged my system understanding to innovate production line
                        systems.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Communication</CardItem>
                        <CardItem>Compassion</CardItem>
                        <CardItem>Problem-solving</CardItem>
                      </CardFooter>
                    </CardContent>
                  </Card>
                </li>
              </ol>
              <div className="mt-12">
                <a
                  className="inline-flex items-baseline leading-tight text-foreground hover:text-primary focus-visible:text-primary font-semibold group/link text-base"
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="View Full Résumé (opens in a new tab)">
                  <span>
                    View Full&nbsp;
                    <span className="inline-block">
                      Résumé
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </section>
          <section
            id="projects"
            className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
            aria-label="Selected projects">
            <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
              <h2 className="text-sm font-bold uppercase tracking-widest text-foreground lg:sr-only">
                Projects
              </h2>
            </div>
            <div>
              <ul className="group/list">
                <li className="mb-12">
                  <Card>
                    <CardContent>
                      <CardTitle href="/">Greenova – Envenge Group</CardTitle>
                      <CardDescription>
                        Developed <strong>Greenova</strong>, a Django-based web application for
                        streamlining environmental management and compliance tracking. The platform
                        featured a modular, accessible interface and supported efficient workflows
                        for managing obligations, documentation, and team responsibilities. Used
                        Docker and a VS Code dev container to ensure a consistent and reproducible
                        development environment.
                      </CardDescription>

                      <CardFooter>
                        <CardItem>Django</CardItem>
                        <CardItem>Docker</CardItem>
                        <CardItem>VS Code Dev Containers</CardItem>
                        <CardItem>PicoCSS</CardItem>
                        <CardItem>Python</CardItem>
                        <CardItem>Github</CardItem>
                      </CardFooter>
                    </CardContent>
                    <CardImage src="https://jared.stanbrook.me/itservicedesk.png"></CardImage>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardContent>
                      <CardTitle href="/">IT Service Desk Portal | Website</CardTitle>
                      <CardDescription>
                        This website was developed to address the unique needs of our student-run
                        support desk, enhancing efficiency by digitising client records and feedback
                        forms to streamline service and improve customer support.
                      </CardDescription>

                      <CardFooter>
                        <CardItem>Typescript</CardItem>
                        <CardItem>Tailwind CSS</CardItem>
                        <CardItem>React</CardItem>
                        <CardItem>Hono</CardItem>
                        <CardItem>Bun</CardItem>
                        <CardItem>SQLite</CardItem>
                      </CardFooter>
                    </CardContent>
                    <CardImage src="https://jared.stanbrook.me/itservicedesk.png"></CardImage>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardContent>
                      <CardTitle href="/">MOBS | Invoice System</CardTitle>
                      <CardDescription>
                        I developed My Own Business System to cater specifically to my needs as an
                        independent disability support worker, streamlining the process of creating
                        invoices.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Mongo DB</CardItem>
                        <CardItem>Express.js</CardItem>
                        <CardItem>Pug</CardItem>
                        <CardItem>Node.js</CardItem>
                      </CardFooter>
                    </CardContent>
                    <CardImage src="https://jared.stanbrook.me/mobs.png"></CardImage>
                  </Card>
                </li>
                <li className="mb-12">
                  <Card>
                    <CardContent>
                      <CardTitle href="/about">Professional Portfolio | Website</CardTitle>
                      <CardDescription>
                        This website was developed for the purpose of displaying my achievements and
                        digitally represent my passion for technology.
                      </CardDescription>
                      <CardFooter>
                        <CardItem>Typescript</CardItem>
                        <CardItem>Tailwind CSS</CardItem>
                        <CardItem>React</CardItem>
                        <CardItem>Hono</CardItem>
                        <CardItem>Bun</CardItem>
                      </CardFooter>
                    </CardContent>
                    <CardImage src="https://jared.stanbrook.me/portfolio.png"></CardImage>
                  </Card>
                </li>
              </ul>
              <div className="mt-12">
                <a
                  className="inline-flex items-center font-medium leading-tight text-foreground group"
                  aria-label="View Full Project Archive"
                  href="/archive">
                  <span>
                    <span className="border-b border-transparent pb-px transition group-hover:border-primary motion-reduce:transition-none">
                      View Full Project&nbsp;
                    </span>
                    <span className="whitespace-nowrap">
                      <span className="border-b border-transparent pb-px transition group-hover:border-primary motion-reduce:transition-none">
                        Archive
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="ml-1 inline-block h-4 w-4 shrink-0 -translate-y-px transition-transform group-hover:translate-x-2 group-focus-visible:translate-x-2 motion-reduce:transition-none"
                        aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"></path>
                      </svg>
                    </span>
                  </span>
                </a>
              </div>
            </div>
          </section>
          <footer className="max-w-md pb-16 text-sm text-secondary-foreground sm:pb-0">
            <p>
              Coded in&nbsp;
              <a
                href="https://code.visualstudio.com/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Visual Studio Code (opens in a new tab)">
                Visual Studio Code
              </a>
              &nbsp; with my bare hands. Built with&nbsp;
              <a
                href="https://react.dev/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="React.dev (opens in a new tab)">
                React
              </a>
              &nbsp;and&nbsp;
              <a
                href="https://tailwindcss.com/"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Tailwind CSS (opens in a new tab)">
                Tailwind CSS
              </a>
              , deployed with&nbsp;
              <a
                href="https://www.cloudflare.com"
                className="font-medium text-muted-foreground hover:text-primary focus-visible:text-primary"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Cloudflare (opens in a new tab)">
                Cloudflare
              </a>
              .
            </p>
          </footer>
        </main>
      </div>
    </>
  );
}
