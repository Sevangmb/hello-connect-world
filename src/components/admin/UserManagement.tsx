<code>
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Define the User interface with extended fields
interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  status: string;
  num_clothes: number;
  num_outfits: number;
  num_followers: number;
  num_following: number;
  account_type: string;
  last_login: string | null;
  num_reports: number;
}

const pageSize = 10;

// Helper function to mask email address partially
function maskEmail(email: string): string {
  const [localPart, domain] = email.split("@");
  if (localPart.length <= 2) return email;
  const firstChar = localPart.charAt(0);
  const lastChar = localPart.charAt(localPart.length - 1);
  const masked = firstChar + "*".repeat(localPart.length - 2) + lastChar;
  return masked + "@" + domain;
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [sortColumn, setSortColumn] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Filtering states
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterAccountType, setFilterAccountType] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Modal state for detailed user view
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch users function from Supabase with filters, sorting and pagination
  const fetchUsers = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from<User>("profiles")
        .select(
          `
          id,
          username,
          email,
          avatar_url,
          created_at,
          status,
          num_clothes,
          num_outfits,
          num_followers,
          num_following,
          account_type,
          last_login,
          num_reports
          `,
          { count: "exact" }
        );

      // Apply filtering conditions
      if (searchTerm) {
        // search by username or email (case insensitive)
        query = query.ilike("username", `%${searchTerm}%`).or(`email.ilike.%${searchTerm}%`);
      }
      if (filterStatus) {
        query = query.eq("status", filterStatus);
      }
      if (filterAccountType) {
        query = query.eq("account_type", filterAccountType);
      }
      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      // Order by specified column and direction
      query = query.order(sortColumn, { ascending: sortDirection === "asc" });

      // Pagination: calculate range (0-indexed)
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;
      setUsers(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when dependencies change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, sortColumn, sortDirection, searchTerm, filterStatus, filterAccountType, startDate, endDate]);

  // Handle sorting when header cell is clicked
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Handlers for filtering inputs
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleAccountTypeChange = (value: string) => {
    setFilterAccountType(value);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
    setCurrentPage(1);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalCount / pageSize);
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Open modal to view detailed user information
  const openUserModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Render the detailed user view inside modal
  const renderUserDetails = () => {
    if (!selectedUser) return null;
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {selectedUser.avatar_url ? (
            <img
              src={selectedUser.avatar_url}
              alt={selectedUser.username}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-300" />
          )}
          <div>
            <h2 className="text-xl font-bold">{selectedUser.username}</h2>
            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <strong>ID Utilisateur: </strong>
            <span>{selectedUser.id}</span>
          </div>
          <div>
            <strong>Date d'inscription: </strong>
            <span>{new Date(selectedUser.created_at).toLocaleDateString()}</span>
          </div>
          <div>
            <strong>Statut du compte: </strong>
            <span>{selectedUser.status}</span>
          </div>
          <div>
            <strong>Type de compte: </strong>
            <span>{selectedUser.account_type}</span>
          </div>
          <div>
            <strong>Nombre de vêtements: </strong>
            <span>{selectedUser.num_clothes}</span>
          </div>
          <div>
            <strong>Nombre de tenues créées: </strong>
            <span>{selectedUser.num_outfits}</span>
          </div>
          <div>
            <strong>Nombre d'abonnés: </strong>
            <span>{selectedUser.num_followers}</span>
          </div>
          <div>
            <strong>Nombre d'abonnements: </strong>
            <span>{selectedUser.num_following}</span>
          </div>
          <div>
            <strong>Dernière connexion: </strong>
            <span>{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString() : "N/A"}</span>
          </div>
          <div>
            <strong>Nombre de signalements: </strong>
            <span>{selectedUser.num_reports}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => alert("Modifier le profil")}>
            Modifier le profil
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Suspendre le compte")}>
            Suspendre le compte
          </Button>
          <Button variant="destructive" size="sm" onClick={() => alert("Bannir le compte")}>
            Bannir le compte
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Réinitialiser le mot de passe")}>
            Réinitialiser le mot de passe
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Envoyer un message")}>
            Envoyer un message
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Forcer le passage en Premium")}>
            Forcer le passage en Premium
          </Button>
          <Button variant="destructive" size="sm" onClick={() => alert("Supprimer le compte")}>
            Supprimer le compte
          </Button>
          <Button variant="outline" size="sm" onClick={() => alert("Exporter les données")}>
            Exporter les données
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Gestion des Utilisateurs</h1>
      
      {/* Filtering Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Rechercher par nom ou e-mail..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Select value={filterStatus} onValueChange={handleStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Statut du compte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="active">Actif</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
            <SelectItem value="banned">Banni</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterAccountType} onValueChange={handleAccountTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Type de compte" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tous</SelectItem>
            <SelectItem value="gratuit">Gratuit</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Input type="date" value={startDate} onChange={handleStartDateChange} placeholder="Du" />
          <Input type="date" value={endDate} onChange={handleEndDateChange} placeholder="Au" />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>ID Utilisateur</TableHead>
              <TableHead>Photo de profil</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>Nom d'utilisateur</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>Adresse e-mail</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("created_at")}>Date d'inscription</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("num_clothes")}>Nombre de vêtements</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("num_outfits")}>Nombre de tenues créées</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("num_followers")}>Nombre d'abonnés</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("num_following")}>Nombre d'abonnements</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("account_type")}>Type de compte</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("last_login")}>Dernière connexion</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("num_reports")}>Nombre de signalements</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : users.length ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-300" />
                    )}
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{maskEmail(user.email)}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{user.num_clothes}</TableCell>
                  <TableCell>{user.num_outfits}</TableCell>
                  <TableCell>{user.num_followers}</TableCell>
                  <TableCell>{user.num_following}</TableCell>
                  <TableCell>{user.account_type}</TableCell>
                  <TableCell>{user.last_login ? new Date(user.last_login).toLocaleString() : "N/A"}</TableCell>
                  <TableCell>{user.num_reports}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => openUserModal(user)}>
                      Voir Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={13} className="text-center">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end gap-2">
        <Button size="sm" onClick={prevPage} disabled={currentPage === 1}>
          Précédent
        </Button>
        <span>
          Page {currentPage} de {totalPages}
        </span>
        <Button size="sm" onClick={nextPage} disabled={currentPage === totalPages || totalPages === 0}>
          Suivant
        </Button>
      </div>

      {/* Detailed User Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Détail de l'utilisateur</DialogTitle>
          </DialogHeader>
          {renderUserDetails()}
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
</code>