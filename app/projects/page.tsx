"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, Globe, Server, Database, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function Projects() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </Button>
        <h1 className="text-4xl font-bold text-center mb-12">All Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project: any) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {project.imageUrl && (
                  <div className="relative w-full h-96 mb-6 rounded-lg overflow-hidden bg-gray-100">
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
                <div className="grid grid-cols-2 gap-2">
                  {project.skills?.map((skill: any) => (
                    <div
                      key={skill.id}
                      className="flex items-center p-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
                    >
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {project.githubUrl && (
                  <Button variant="outline" asChild>
                    <Link href={project.githubUrl} target="_blank" className="flex items-center">
                      <Code className="w-4 h-4 mr-2" />
                      View Code
                    </Link>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button asChild className="bg-blue-600 hover:bg-blue-700">
                    <Link href={project.liveUrl} target="_blank" className="flex items-center">
                      <Globe className="w-4 h-4 mr-2" />
                      Live Demo
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
