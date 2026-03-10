import { getClients } from "@/server/actions/clients";
import { ClientDialog } from "@/components/clients/client-dialog";
import { ClientCardActions } from "@/components/clients/client-card-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Building2 } from "lucide-react";
import Link from "next/link";
import { Client } from "@/lib/validations/client";

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
        <ClientDialog />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.length === 0 ? (
          <div className="col-span-full text-center p-12 border border-dashed rounded-lg bg-card">
            <p className="text-muted-foreground mb-4">No clients found.</p>
            <ClientDialog />
          </div>
        ) : (
          clients.map((client) => (
            <Card key={client.id} className="flex flex-col">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-xl">{client.name}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1.5">
                     <Building2 className="h-3 w-3" /> {client.company || "Individual"}
                  </CardDescription>
                </div>
                <ClientCardActions client={client as Client} />
              </CardHeader>
              <CardContent className="flex-1 space-y-4 pt-4">
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
