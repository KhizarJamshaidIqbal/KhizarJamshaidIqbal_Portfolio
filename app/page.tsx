"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, ExternalLink, Code, Server, Database, Cloud, Globe, Terminal, Cpu, Cog, FileText } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from "framer-motion"
import { useInView } from 'react-intersection-observer'
import { ResumeButton } from "@/components/resume-button"

const skillsData = [
  { id: 1, name: "JavaScript", icon: Globe, color: "text-yellow-400" },
  { id: 2, name: "TypeScript", icon: Code, color: "text-blue-500" },
  { id: 3, name: "React", icon: Cpu, color: "text-cyan-400" },
  { id: 4, name: "Node.js", icon: Server, color: "text-green-500" },
  { id: 5, name: "Python", icon: Terminal, color: "text-yellow-300" },
  { id: 6, name: "SQL", icon: Database, color: "text-orange-500" },
  { id: 7, name: "AWS", icon: Cloud, color: "text-yellow-500" },
  { id: 8, name: "Docker", icon: Cog, color: "text-blue-400" },
  { id: 9, name: "Git", icon: Code, color: "text-red-500" },
  { id: 10, name: "GitHub", icon: Github, color: "text-gray-600" },
  { id: 11, name: "LinkedIn", icon: Linkedin, color: "text-blue-600" },
  { id: 12, name: "Email", icon: Mail, color: "text-red-500" },
  { id: 13, name: "Website", icon: ExternalLink, color: "text-gray-600" },
  { id: 14, name: "Artificial Intelligence", icon: Cpu, color: "text-yellow-500" },
  { id: 15, name: "Machine Learning", icon: Terminal, color: "text-green-500" },
  { id: 16, name: "Deep Learning", icon: Cog, color: "text-blue-400" },
  { id: 17, name: "Fast Api", icon: Server, color: "text-pink-500" },
]

const FadeInWhenVisible = ({ children }: { children: React.ReactNode }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    rootMargin: '-100px 0px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: inView ? 0 : 50, opacity: inView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/admin/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              KhizarJamshaidIqbal
            </h1>
            <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">Software Engineer</p>
            <div className="flex justify-center space-x-4">
              <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Link href="/projects">View All Projects</Link>
              </Button>
              <Button variant="outline" asChild className="border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900">
                <Link href="/contact">Contact Me</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* About Sect  ion */}
        <FadeInWhenVisible>
        <section id="about" className="py-20">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <Card className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-xl">
            <CardContent className="prose dark:prose-invert max-w-none p-6">
              <p>
                Hello! I'm KhizarJamshaidIqbal, a passionate Software Engineer with a keen interest in building robust and scalable applications. 
                With a strong foundation in various programming languages and frameworks, I strive to create efficient solutions to complex problems.
        </p>
        <p>
          My journey in software engineering has equipped me with skills in full-stack development, cloud technologies, and agile methodologies. 
          I'm always excited to take on new challenges and contribute to innovative projects.
        </p>
      </CardContent>
    </Card>
  </section>
        </FadeInWhenVisible>

        {/* Skills Section */}
        <section id="skills"  className="py-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12">Skills</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {skillsData.map((skill) => (
                <Card key={skill.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 flex flex-col items-center justify-center space-y-2">
                    <skill.icon className={`w-8 h-8 ${skill.color} group-hover:scale-110 transition-transform duration-300`} />
                    <p className="text-sm font-medium text-center">{skill.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </FadeInWhenVisible>
        </section>

        {/* Featured Projects Section */}
        <section id="projects"  className="py-16">
          <FadeInWhenVisible>
            <h2 className="text-3xl font-bold text-center mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project: any) => (
                <Card key={project.id} className="group hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {project.imageUrl && (
                      <div className="relative w-full h-96 mb-4 rounded-lg overflow-hidden  bg-gray-100">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          onError={(e: any) => {
                            e.target.src = '/placeholder.png';
                            e.target.className = 'object-contain p-4';
                          }}
                        />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {project.skills?.map((skill: any) => (
                        <Badge key={skill.id} variant="secondary">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {project.githubUrl && (
                      <Button asChild variant="outline">
                        <Link href={project.githubUrl} target="_blank">
                          <Code className="w-4 h-4 mr-2" />
                          View Code
                        </Link>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button asChild>
                        <Link href={project.liveUrl} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Live Demo
                        </Link>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="secondary" size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Link href="/projects" className="inline-flex items-center">
                  View All Projects
                </Link>
              </Button>
            </div>
          </FadeInWhenVisible>
        </section>

        {/* Contact Section */}
        <FadeInWhenVisible>
  <section id="contact" className="py-20">
    <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
    <div className="flex justify-center space-x-4">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <a href="https://github.com/KhizarJamshaidIqbal" target="_blank" rel="noopener noreferrer">
            <Github className="h-6 w-6" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <a href="https://linkedin.com/in/KhizarJamshaidIqbal" target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button variant="outline" size="icon" asChild className="rounded-full">
          <a href="mailto:khizarjamshaid7@gmail.com">
            <Mail className="h-6 w-6" />
            <span className="sr-only">Email</span>
          </a>
        </Button>
      </motion.div>
    </div>
    <div className="text-center mt-8">
      <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
        <Link href="/contact">Contact Me</Link>
      </Button>
    </div>
  </section>
        </FadeInWhenVisible>

        {/* Resume Button */}
        <div className="fixed bottom-8 right-8">
          <ResumeButton />
        </div>
      </div>
    </main>
  );
}
