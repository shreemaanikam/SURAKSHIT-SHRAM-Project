import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DesignSystemPage() {
  return (
    <div className="container mx-auto py-10 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Design System</h1>
        <p className="text-muted-foreground">Verification page for tokens and primitives.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Colors & Tokens</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <ColorSwatch name="Background" variable="var(--background)" />
          <ColorSwatch name="Foreground" variable="var(--foreground)" />
          <ColorSwatch name="Card" variable="var(--card)" />
          <ColorSwatch name="Popover" variable="var(--popover)" />
          <ColorSwatch name="Primary" variable="var(--primary)" />
          <ColorSwatch name="Secondary" variable="var(--secondary)" />
          <ColorSwatch name="Muted" variable="var(--muted)" />
          <ColorSwatch name="Accent" variable="var(--accent)" />
          <ColorSwatch name="Destructive" variable="var(--destructive)" />
          <ColorSwatch name="Warning" variable="var(--warning)" />
          <ColorSwatch name="Success" variable="var(--success)" />
          <ColorSwatch name="Border" variable="var(--border)" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Typography</h2>
        <div className="space-y-4">
          <div className="text-4xl font-bold">Heading 1</div>
          <div className="text-3xl font-semibold">Heading 2</div>
          <div className="text-2xl font-semibold">Heading 3</div>
          <div className="text-xl font-semibold">Heading 4</div>
          <p className="text-base">Body Base: The quick brown fox jumps over the lazy dog.</p>
          <p className="text-sm">Body Small: The quick brown fox jumps over the lazy dog.</p>
          <p className="text-muted-foreground">Muted text color for less important information.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Inputs & Forms</h2>
        <div className="grid max-w-sm items-center gap-1.5">
          <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
          <Input type="email" id="email" placeholder="Email" />
          <p className="text-sm text-muted-foreground">Enter your email address.</p>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Badges (Status Indicators)</h2>
        <div className="flex flex-wrap gap-4">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold border-b pb-2">Cards</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content. This is a basic card component to wrap content.</p>
            </CardContent>
            <CardFooter>
              <Button>Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

    </div>
  )
}

function ColorSwatch({ name, variable }: { name: string, variable: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="h-16 w-16 rounded-md border shadow-sm" 
        style={{ backgroundColor: variable }} 
      />
      <span className="text-sm font-medium">{name}</span>
    </div>
  )
}
