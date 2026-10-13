export interface IBrokerServer {
  id: string;
  name: string;
  mt_version: number;
}

export interface SelectBrokerServerProps {
  setSelectedServer: (server: string) => void;
  mt_version: number;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
}
