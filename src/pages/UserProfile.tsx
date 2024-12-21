import React, { useState, useEffect } from 'react';
import styles from '../styles/components/UserProfile.module.css'; // CSS import
import ReservationCard from '../components/ReservationCard'; // ReservationCard 컴포넌트 import
import { useAuth } from '../contexts/AuthContext'; // AuthContext를 통해 로그인 상태 관리

interface Reservation {
  reservation_id: string;
  user_id: string;
  show_id: string;
  seat: string;
  date: string;
}

export const UserProfile: React.FC = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationsVisible, setIsReservationsVisible] = useState(false);
  const { username } = useAuth(); // 로그인된 유저의 ID
  const [email, setEmail] = useState<string | null>(null); // 유저 이메일

  // CSV 파일에서 예약 데이터 로드
  useEffect(() => {
    const fetchReservations = async () => {
      const response = await fetch('/data/reservations.csv');
      const text = await response.text();

      const rows = text.split('\n').slice(1); // 첫 번째 줄은 헤더
      const parsedReservations = rows
        .map((row) => {
          const [reservation_id, user_id, show_id, seat, date] = row.split(',');
          return { reservation_id, user_id, show_id, seat, date };
        })
        .filter((res) => res.user_id === username); // 현재 사용자에 대한 예약만 필터링

      setReservations(parsedReservations);
    };

    fetchReservations();
  }, [username]);

  // 유저 이메일 로드 (예: users.csv 사용)
  useEffect(() => {
    const fetchEmail = async () => {
      const response = await fetch('/data/users.csv'); // users.csv 파일 로드
      const text = await response.text();

      const rows = text.split('\n').slice(1); // 첫 번째 줄은 헤더
      const user = rows
        .map((row) => {
          const [id, , email] = row.split(','); // ID와 이메일 매핑
          return { id, email };
        })
        .find((u) => u.id === username); // 현재 로그인된 유저의 ID와 매칭

      if (user) {
        setEmail(user.email); // 현재 유저의 이메일 설정
      }
    };

    if (username) {
      fetchEmail();
    }
  }, [username]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords({ ...passwords, [name]: value });
  };

  const handlePasswordSubmit = () => {
    if (passwords.newPassword !== passwords.confirmNewPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    // TODO: 현재 비밀번호 확인 로직 및 비밀번호 변경 API 호출
    alert('Password updated successfully!');
    setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const toggleReservationsVisibility = () => {
    setIsReservationsVisible(!isReservationsVisible);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Profile</h1>
      <div className={styles.section}>
        <h2>User ID: {username || 'Unknown User'}</h2>
        <h3>Email: {email || 'Loading...'}</h3>
      </div>

      <div className={styles.section}>
        <h2>Change Password</h2>
        <input
          type="password"
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handlePasswordChange}
          placeholder="Current Password"
          className={styles.input}
        />
        <input
          type="password"
          name="newPassword"
          value={passwords.newPassword}
          onChange={handlePasswordChange}
          placeholder="New Password"
          className={styles.input}
        />
        <input
          type="password"
          name="confirmNewPassword"
          value={passwords.confirmNewPassword}
          onChange={handlePasswordChange}
          placeholder="Confirm New Password"
          className={styles.input}
        />
        <button onClick={handlePasswordSubmit} className={styles.button}>
          Update Password
        </button>
      </div>

      <div className={styles.section}>
        <h2>My Reservations</h2>
        <button onClick={toggleReservationsVisibility} className={styles.toggleButton}>
          {isReservationsVisible ? 'Hide Reservations' : 'Show Reservations'}
        </button>
        {isReservationsVisible && (
          <div className={styles.reservations}>
            {reservations.map((res) => (
              <ReservationCard key={res.reservation_id} reservation={res} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
