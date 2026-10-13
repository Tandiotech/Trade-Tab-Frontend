export interface Broker {
    [key: string]: any; // Generaliza los campos del broker para simplificar, ajusta según tu modelo exacto
  }
  
export interface UpdateBrokerProps {
    broker?: Broker;
    onSave: (broker: Broker) => void;
  }
  