"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  image: string;
  created_at: string;
}

const ProjectsDisplay = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProjects((data as unknown as Project[]) || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    loadProjects();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-secondary">
            My Projects
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my portfolio of projects showcasing various technologies and solutions.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col h-full hover:shadow-lg transition-shadow">
              {project.image && (
                <div className="w-full h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription className="text-base">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags && project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                {project.link && (
                  <Button asChild variant="default" className="w-full">
                    <Link href={project.link} target="_blank" rel="noopener noreferrer">
                      <ExternalLink size={16} className="mr-2" />
                      View Project
                    </Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsDisplay;