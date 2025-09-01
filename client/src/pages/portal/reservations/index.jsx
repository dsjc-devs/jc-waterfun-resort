import { APP_DEFAULT_PATH } from "config/config";

import React from "react";
import Breadcrumbs from "components/@extended/Breadcrumbs";
import PageTitle from "components/PageTitle";
import ReservationsTable from "sections/portal/modules/reservations/Table";

const Reservations = () => {
  const breadcrumbLinks = [
    { title: "Home", to: APP_DEFAULT_PATH },
    { title: "Reservations" },
  ];

  return (
    <React.Fragment>
      <PageTitle title="Reservations" />
      <Breadcrumbs
        custom
        heading="Reservations"
        links={breadcrumbLinks}
        subheading="Manage and monitor reservations at John Cezar Waterfun Resort."
      />

      <ReservationsTable />
    </React.Fragment>
  );
};

export default Reservations;
