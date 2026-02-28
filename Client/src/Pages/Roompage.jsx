function RoomPage() {
  const [searchParams] = useSearchParams();
  const roomCode = searchParams.get("code");

  const [joined, setJoined] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`room-${roomCode}`);
    if (saved) {
      setJoined(true);
    }
  }, [roomCode]);

  return (
    <>
      {!joined ? (
        <JoinGate
          roomCode={roomCode}
          onSuccess={(username, avatarIndex) => {
            localStorage.setItem(
              `room-${roomCode}`,
              JSON.stringify({ username, avatarIndex }),
            );
            setJoined(true);
          }}
        />
      ) : (
        <Lobby roomCode={roomCode} />
      )}
    </>
  );
}
