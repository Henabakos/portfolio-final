"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ImageUpload } from "@/components/admin/image-upload";
import { RichTextEditor } from "@/components/rich-text-editor";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewProject() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newServiceArea, setNewServiceArea] = useState("");
  const [newChallengeImage, setNewChallengeImage] = useState("");
  const [project, setProject] = useState({
    title: "",
    description: "",
    image: "",
    category: "",
    link: "",
    tags: [] as string[],
    featured: false,
    client: "",
    timeline: "",
    serviceArea: [] as string[],
    introduction: "",
    goal: "",
    challenge: "",
    challengeImages: [] as string[],
    outcomes: [] as Array<{
      percentage: string;
      title: string;
      description: string;
    }>,
    testimonial: {
      author: "",
      position: "",
      quote: "",
      image: "",
    },
    conclusion: "",
  });

  const handleSave = async () => {
    if (!project.title || !project.description || !project.image) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        router.push("/admin/projects");
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project");
    } finally {
      setSaving(false);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim())) {
      setProject({
        ...project,
        tags: [...project.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setProject({
      ...project,
      tags: project.tags.filter((_, i) => i !== index),
    });
  };

  const addServiceArea = () => {
    if (
      newServiceArea.trim() &&
      !project.serviceArea.includes(newServiceArea.trim())
    ) {
      setProject({
        ...project,
        serviceArea: [...project.serviceArea, newServiceArea.trim()],
      });
      setNewServiceArea("");
    }
  };

  const removeServiceArea = (index: number) => {
    setProject({
      ...project,
      serviceArea: project.serviceArea.filter((_, i) => i !== index),
    });
  };

  const addChallengeImage = () => {
    if (newChallengeImage.trim()) {
      setProject({
        ...project,
        challengeImages: [...project.challengeImages, newChallengeImage.trim()],
      });
      setNewChallengeImage("");
    }
  };

  const removeChallengeImage = (index: number) => {
    setProject({
      ...project,
      challengeImages: project.challengeImages.filter((_, i) => i !== index),
    });
  };

  const addOutcome = () => {
    setProject({
      ...project,
      outcomes: [
        ...project.outcomes,
        { percentage: "", title: "", description: "" },
      ],
    });
  };

  const updateOutcome = (index: number, field: string, value: string) => {
    const newOutcomes = [...project.outcomes];
    newOutcomes[index] = { ...newOutcomes[index], [field]: value };
    setProject({ ...project, outcomes: newOutcomes });
  };

  const removeOutcome = (index: number) => {
    setProject({
      ...project,
      outcomes: project.outcomes.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/projects">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">New Project</h1>
          <p className="text-gray-600">Create a new portfolio project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={project.title}
                  onChange={(e) =>
                    setProject({ ...project, title: e.target.value })
                  }
                  placeholder="Enter project title"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={project.category}
                  onChange={(e) =>
                    setProject({ ...project, category: e.target.value })
                  }
                  placeholder="e.g., Web Design, Mobile App"
                />
              </div>

              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  value={project.client}
                  onChange={(e) =>
                    setProject({ ...project, client: e.target.value })
                  }
                  placeholder="Enter client name"
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={project.timeline}
                  onChange={(e) =>
                    setProject({ ...project, timeline: e.target.value })
                  }
                  placeholder="e.g., 3 months, Jan - Mar 2024"
                />
              </div>

              <div>
                <Label htmlFor="link">Project Link</Label>
                <Input
                  id="link"
                  value={project.link}
                  onChange={(e) =>
                    setProject({ ...project, link: e.target.value })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={project.featured}
                  onCheckedChange={(checked) =>
                    setProject({ ...project, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured Project</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={project.description}
                onChange={(e) =>
                  setProject({ ...project, description: e.target.value })
                }
                placeholder="Brief description for project cards..."
                rows={3}
              />
            </div>

            <div>
              <Label>Project Image *</Label>
              <ImageUpload
                value={project.image}
                onChange={(url) => setProject({ ...project, image: url })}
                placeholder="Upload project image"
              />
            </div>
          </CardContent>
        </Card>

        {/* Service Areas */}
        <Card>
          <CardHeader>
            <CardTitle>Service Areas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add Service Area</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newServiceArea}
                  onChange={(e) => setNewServiceArea(e.target.value)}
                  placeholder="e.g., UI/UX Design, Branding"
                  onKeyPress={(e) => e.key === "Enter" && addServiceArea()}
                />
                <Button onClick={addServiceArea} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.serviceArea.map((area, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {area}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeServiceArea(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add Tags</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(index)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={project.introduction}
              onChange={(content) =>
                setProject({ ...project, introduction: content })
              }
              placeholder="Write the project introduction..."
            />
          </CardContent>
        </Card>

        {/* Goal */}
        <Card>
          <CardHeader>
            <CardTitle>Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={project.goal}
              onChange={(content) => setProject({ ...project, goal: content })}
              placeholder="Describe the project goals..."
            />
          </CardContent>
        </Card>

        {/* Challenge */}
        <Card>
          <CardHeader>
            <CardTitle>Challenge</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RichTextEditor
              content={project.challenge}
              onChange={(content) =>
                setProject({ ...project, challenge: content })
              }
              placeholder="Describe the challenges faced..."
            />

            <div>
              <Label>Challenge Images</Label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={newChallengeImage}
                  onChange={(e) => setNewChallengeImage(e.target.value)}
                  placeholder="Image URL"
                  onKeyPress={(e) => e.key === "Enter" && addChallengeImage()}
                />
                <Button onClick={addChallengeImage} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {project.challengeImages.map((image, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded"
                  >
                    <span className="flex-1 text-sm truncate">{image}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeChallengeImage(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Outcomes */}
        <Card>
          <CardHeader>
            <CardTitle>Outcomes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.outcomes.map((outcome, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-semibold">Outcome {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeOutcome(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Percentage</Label>
                    <Input
                      value={outcome.percentage}
                      onChange={(e) =>
                        updateOutcome(index, "percentage", e.target.value)
                      }
                      placeholder="e.g., 95%"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Title</Label>
                    <Input
                      value={outcome.title}
                      onChange={(e) =>
                        updateOutcome(index, "title", e.target.value)
                      }
                      placeholder="Outcome title"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={outcome.description}
                    onChange={(e) =>
                      updateOutcome(index, "description", e.target.value)
                    }
                    placeholder="Describe the outcome..."
                    rows={2}
                  />
                </div>
              </div>
            ))}
            <Button
              onClick={addOutcome}
              variant="outline"
              className="w-full bg-transparent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Outcome
            </Button>
          </CardContent>
        </Card>

        {/* Testimonial */}
        <Card>
          <CardHeader>
            <CardTitle>Testimonial</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonial-author">Author Name</Label>
                <Input
                  id="testimonial-author"
                  value={project.testimonial.author}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      testimonial: {
                        ...project.testimonial,
                        author: e.target.value,
                      },
                    })
                  }
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label htmlFor="testimonial-position">Position</Label>
                <Input
                  id="testimonial-position"
                  value={project.testimonial.position}
                  onChange={(e) =>
                    setProject({
                      ...project,
                      testimonial: {
                        ...project.testimonial,
                        position: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., CEO at Company"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="testimonial-quote">Quote</Label>
              <Textarea
                id="testimonial-quote"
                value={project.testimonial.quote}
                onChange={(e) =>
                  setProject({
                    ...project,
                    testimonial: {
                      ...project.testimonial,
                      quote: e.target.value,
                    },
                  })
                }
                placeholder="Client testimonial..."
                rows={4}
              />
            </div>
            <div>
              <Label>Author Image (Optional)</Label>
              <Input
                value={project.testimonial.image}
                onChange={(e) =>
                  setProject({
                    ...project,
                    testimonial: {
                      ...project.testimonial,
                      image: e.target.value,
                    },
                  })
                }
                placeholder="Image URL"
              />
            </div>
          </CardContent>
        </Card>

        {/* Conclusion */}
        <Card>
          <CardHeader>
            <CardTitle>Conclusion</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={project.conclusion}
              onChange={(content) =>
                setProject({ ...project, conclusion: content })
              }
              placeholder="Write the project conclusion..."
            />
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4 sticky bottom-0 bg-background p-4 border-t">
        <Link href="/admin/projects">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Creating..." : "Create Project"}
        </Button>
      </div>
    </div>
  );
}
