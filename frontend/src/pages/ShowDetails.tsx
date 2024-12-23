import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getShowById } from "../services/showService"; // showService의 API 함수
import ShowDetailForm from "../components/ShowDetailForm";
import ReservationForm from "../components/ReservationForm";
import styles from "../styles/pages/ShowDetails.module.css";
import { Show } from "../types/Show";

const ShowDetails: React.FC = () => {
  const { show_id } = useParams<{ show_id: string }>(); // URL의 show_id 추출
  const [showData, setShowData] = useState<Show | null>(null); // 쇼 데이터 상태
  const [error, setError] = useState<string | null>(null); // 에러 상태

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (show_id) {
          const show = await getShowById(parseInt(show_id)); // API 호출
          if (show) {
            setShowData(show); // 성공 시 쇼 데이터 상태 업데이트
          } else {
            setError("Show not found."); // 쇼가 없을 때 에러 설정
          }
        }
      } catch (err) {
        setError("Failed to load show details."); // API 호출 실패 시 에러 설정
      }
    };

    fetchDetails();
  }, [show_id]);

  if (error) {
    return <div className={styles.error}>{error}</div>; // 에러 표시
  }

  if (!showData) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  return (
    <div className={styles.container}>
      {/* 쇼 상세 정보 */}
      <div className={styles.detailsSection}>
        <ShowDetailForm showData={showData} /> {/* 쇼 상세 정보 컴포넌트 */}
      </div>

      {/* 예약 폼 */}
      <div className={styles.reservationSection}>
        <ReservationForm showData={showData} /> {/* 예약 폼 컴포넌트 */}
      </div>
    </div>
  );
};

export default ShowDetails;
