import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowById } from "../services/showService";
import ShowDetailForm from "../components/ShowDetailForm";
import ReservationForm from "../components/ReservationForm";
import { updateInterest } from "../services/userInterestService";
import { useAuth } from "../contexts/AuthContext";
import styles from "../styles/pages/ShowDetails.module.css";
import { Show } from "../types/Show";

const ShowDetails: React.FC = () => {
  const { show_id } = useParams<{ show_id: string }>();
  const { username } = useAuth(); 
  const [showData, setShowData] = useState<Show | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (show_id) {
          const show = await getShowById(parseInt(show_id));
          if (show) {
            setShowData(show);

            if (username) {
              await updateInterest(username, show.genre, "search");
            }
          } else {
            setError("Show not found.");
          }
        }
      } catch (err) {
        setError("Failed to load show details.");
      }
    };

    fetchDetails();
  }, [show_id, username]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!showData) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailsSection}>
        <ShowDetailForm showData={showData} />
      </div>
      <div className={styles.reservationSection}>
        <ReservationForm showData={showData} />
      </div>
    </div>
  );
};

export default ShowDetails;