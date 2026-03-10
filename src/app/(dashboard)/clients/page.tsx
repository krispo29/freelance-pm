import { getClients } from "@/server/actions/clients";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Manage your client contacts.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Client
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="col-span-full text-center p-12 border border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">No clients found.</p>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Add your first client
            </Button>
          </div>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{client.name}</CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                   <Building2 className="h-3 w-3" /> {client.company || "Individual"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2 text-sm">
                  {client.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <a href={`mailto:${client.email}`} className="hover:text-primary hover:underline truncate">{client.email}</a>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4 shrink-0" />
                      <a href={`tel:${client.phone}`} className="hover:text-primary hover:underline">{client.phone}</a>
                    </div>
                  )}
                </div>

                {client.projects && client.projects.length > 0 && (
                  <div className="pt-4 border-t">
                    <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-2">Projects</h4>
                    <ul className="space-y-1">
                      {client.projects.map((p) => (
                        <li key={p.id}>
                          <Link href={`/projects/${p.id}`} className="text-sm text-primary hover:underline line-clamp-1">
                            {p.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
