import React, { useState, useEffect } from "react";
import { auth, firestore } from "../firebase/firebase";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { FaUsers } from "react-icons/fa"; // Icon for UI enhancement
import styles from "./communityInfo.module.css";
import defaultProfile from '../../assets/default-profile.png'
function CommunityInfo() {
  const [communityData, setCommunityData] = useState(null);
  const [docId, setDocId] = useState(
    auth.currentUser.email.match(/^admin(\w+)@/)[1].charAt(0).toUpperCase() + auth.currentUser.email.match(/^admin(\w+)@/)[1].slice(1)
  );
  const [members, setMembers] = useState([]);
  const [membersDetails, setMembersDetails] = useState([]);

  useEffect(() => {
    if (!docId) return;

    const docRef = doc(firestore, "community", docId);
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCommunityData({ id: docSnap.id, ...data });
        setMembers(data.members || []);

        if (data.members?.length > 0) {
          try {
            const memberDocs = await Promise.all(
              data.members.map(async (memberId) => {
                const memberRef = doc(firestore, "userDetails", memberId);
                const memberSnap = await getDoc(memberRef);
                return memberSnap.exists()
                  ? { id: memberSnap.id, ...memberSnap.data() }
                  : null;
              })
            );

            setMembersDetails(memberDocs.filter((doc) => doc !== null));
          } catch (error) {
            console.error("Error fetching member details:", error);
          }
        } else {
          setMembersDetails([]);
        }
      } else {
        setCommunityData(null);
        setMembers([]);
        setMembersDetails([]);
      }
    });

    return () => unsubscribe();
  }, [docId]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <FaUsers className={styles.icon} />
          <h2 className={styles.title}>Community Info</h2>
        </div>

        {communityData ? (
          <div>
            <h3 className={styles.communityName}>
              {communityData.id.toUpperCase()}
            </h3>

            <h4 className={styles.subtitle}>Members</h4>

            {membersDetails.length > 0 ? (
              <div className={styles.membersList}>
                {membersDetails.map((member) => (
                  <div key={member.id} className={styles.memberCard}>
                    <img
                      src={member?.userProfile || defaultProfile}
                      alt={member.userData?.name }
                      className={styles.memberImage}
                    />
                    <div className={styles.memberInfo}>
                      <h3 className={styles.memberName} >
                        {member.userData?.name ||'Anonymous User'}
                      </h3>
                      <p className={styles.memberProfession}>
                        {member.userData?.profession || "N/A"}
                      </p>
                      <p className={styles.memberAddress}>
                        {member.userData?.address || "N/A"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.loading}>No members found.</p>
            )}
          </div>
        ) : (
          <p className={styles.loading}>Loading community data...</p>
        )}
      </div>
    </div>
  );
}

export default CommunityInfo;
