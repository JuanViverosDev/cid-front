import {
  Dashboard,
  Positions,
  RequestTypes,
  Roles,
  Users,
  Systems,
  ProcessStates,
  ContactTypes,
  Request,
  PublicDefenders,
  Plantillas,
  FechasVenc,
  Busqueda,
  Notificaciones
} from '../screens';

import { RoutePermission } from './RoutePermission';

export const MenuRoutes = () => {
  return (
    <>
      <RoutePermission path="/dashboard" element={<Dashboard />} />
      <RoutePermission path="/roles" element={<Roles />} />
      <RoutePermission path="/users" element={<Users />} />
      <RoutePermission path="/positions" element={<Positions />} />
      <RoutePermission path="/request-types" element={<RequestTypes />} />
      <RoutePermission path="/systems" element={<Systems />} />
      <RoutePermission path="/process-states" element={<ProcessStates />} />
      <RoutePermission path="/contact-types" element={<ContactTypes />} />
      <RoutePermission path="/request" element={<Request />} />
      <RoutePermission path="/public-defenders" element={<PublicDefenders />} />
      <RoutePermission path="/templates" element={<Plantillas />} />
      <RoutePermission path="/fechas-vencimiento" element={<FechasVenc />} />
      <RoutePermission path="/busqueda" element={<Busqueda />} /> 
      <RoutePermission path="/notificaciones" element={<Notificaciones />} />
    </>
  );
};
