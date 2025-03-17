import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase/firebase";
import { doc, onSnapshot,getDoc,updateDoc } from "firebase/firestore";
import styles from "./dashBoard.module.css";
function DashBoard() {
  const [communityData, setCommunityData] = useState(null);
  const [docId, setDocId] = useState(auth.currentUser.email.match(/^admin(\w+)@/)[1].charAt(0).toUpperCase() + auth.currentUser.email.match(/^admin(\w+)@/)[1].slice(1));
  console.log(docId,auth.currentUser.email)   //for checking
  useEffect(() => {
    if (!docId) return;

    const docRef = doc(firestore, "community", docId);

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCommunityData({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
        setCommunityData(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener when component unmounts
  }, [docId]);
  return (
    <div className={styles.container}>
      {communityData?.application.length>0?communityData?.application.map((info, ind) => {
        return <ApplicationContainer docId={docId} key={ind} info={info} />;
      }):(<EmptyContainer/>)}
    </div>
  );
}


const EmptyContainer=()=>{
  return <div className={styles.emptyContainer}>

  </div>
}

const statuses = ["acknowledged", "inProgress", "resolved"];

const ApplicationContainer = ({ info,docId }) => {
  const [status, setStatus] = useState(info.status);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // 🔥 Fetch latest status from Firestore when component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const communityRef = doc(firestore, "community", "kadayanallur");
        const communitySnap = await getDoc(communityRef);

        if (communitySnap.exists()) {
          const applications = communitySnap.data().application || [];
          const currentApp = applications.find((app) => app.applicationID === info.applicationID);

          if (currentApp) {
            setStatus(currentApp.status); // 🔥 Sync UI with Firestore status
          }
        }
      } catch (error) {
        console.error("Error fetching status:", error);
      }
    };

    fetchStatus();
  }, [info.applicationID]); // Runs when component mounts or applicationID changes

  const updateStatus = async () => {
    if (!selectedStatus) return;
    setShowConfirm(false);

    try {
      const communityRef = doc(firestore, "community", "tenkasi");
      const communitySnap = await getDoc(communityRef);

      if (!communitySnap.exists()) {
        console.error("Community document does not exist.");
        return;
      }

      const applications = communitySnap.data().application || [];

      // 🔥 Update only the relevant application's status using applicationID
      const updatedApplications = applications.map((app) =>
        app.applicationID === info.applicationID ? { ...app, status: selectedStatus } : app
      );

      await updateDoc(communityRef, { application: updatedApplications });

      setStatus(selectedStatus); // 🔥 Update local state to reflect change
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleStatusClick = (newStatus) => {
    setSelectedStatus(newStatus);
    setShowConfirm(true);
  };

  return (
    <div className={styles.applicationContainerWrapper}>
      <h2 className={styles.title}>{info.title}</h2>
      <p className={styles.category}>
        Category: <b>{info.category.replace("_", " ")}</b>
      </p>
      <p className={styles.desc}>{info.desc}</p>
      <p className={styles.sender}>
        From: <span>{info.sender}</span>
      </p>
      <p className={styles.dateTime}>
        {info.date} | {info.time}
      </p>

      <div className={styles.statusContainer}>
        {status === "submitted" && (
          <>
            <button
              className={`${styles.statusButton} ${styles.rejectButton}`}
              onClick={() => handleStatusClick("rejected")}
            >
              Reject
            </button>
            <button
              className={`${styles.statusButton} ${styles.approveButton}`}
              onClick={() => handleStatusClick("acknowledged")}
            >
              Approve
            </button>
          </>
        )}
        {status === "rejected" && (
          <span className={styles.rejectedText}>Application Rejected</span>
        )}
        {status !== "rejected" && status !== "submitted" &&
          statuses.map((s) => (
            <button
              key={s}
              className={`${styles.statusButton} ${status === s ? styles.active : ""} ${statuses.indexOf(s) < statuses.indexOf(status) ? styles.strikethrough : ""}`}
              onClick={() => handleStatusClick(s)}
              disabled={statuses.indexOf(s) < statuses.indexOf(status) || status === "resolved"}
            >
              {s}
            </button>
          ))
        }
      </div>

      {showConfirm && (
        <div className={styles.modal}>
          <p>Are you sure you want to update the status to {selectedStatus}?</p>
          <button onClick={updateStatus} className={styles.confirmButton}>Yes</button>
          <button onClick={() => setShowConfirm(false)} className={styles.cancelButton}>No</button>
        </div>
      )}

      {info.attachments?.length > 0 && (
        <div className={styles.attachmentContainer}>
          {info.attachments.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="attachment"
              className={styles.attachment}
            />
          ))}
        </div>
      )}
    </div>
  );
};







export default DashBoard;

// {
//   "title": "Poor Water Management: A Looming Crisis",
//   "date": "2025-02-27",
//   "desc": "Poor water management results in the unsustainable use of water resources, leading to scarcity and pollution. Mismanagement includes inefficient irrigation practices, over-extraction of groundwater, and contamination from industrial and agricultural activities. Urban areas face challenges with outdated infrastructure, resulting in leaks and wastage. ",
//   "attachments": [
//     "https://res.cloudinary.com/dja1myfkv/image/upload/v1740680786/hmyrvhhpmpzi85tbgpzl.jpg"
//   ],
//   "sender": "Giridharan",
//   "time": "11:56 PM",
//   "status": "inProgress",
//   "category": "waste_management"
// },
