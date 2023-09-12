import { useState, useEffect } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";
import Certificates from "./components/Certificates";
import Skeleton from "./components/Skeleton";

function App() {
    const location = useLocation();
    const guid = new URLSearchParams(location.search).get("guid");
    const [data, setData] = useState(null);
    const [metroData, setMetroData] = useState(null);
    // const [chosenTab, setChosenTab] = useState("Описание");
    const [loading, setLoading] = useState(false);
    const responceId = data?.catalogOfEquipmentItem.id;

    const [imageLoaded, setImageLoaded] = useState(false);

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    console.log(responceId);

    // Функция для валидации GUID
    const validateGUID = (guid) => {
        const guidPattern = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        return guidPattern.test(guid);
    };
    const [guidIsValid, setGuidIsValid] = useState(validateGUID(guid));

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://testapi.cenergo.by/api/XLabEquipmentPublic/GetXLabEquipmentInfo(id=${guid})`);
            if (response.ok) {
                const responseData = await response.json();
                setData(responseData);
            } else {
                console.error("HTTP Error:", response.status);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMetroData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://testapi.cenergo.by/api/XLabEquipmentPublic/GetXLabEquipmentMetrologicInfo(id=${guid})`);
            if (response.ok) {
                const responseData = await response.json();
                setMetroData(responseData);
            } else {
                console.error("HTTP Error:", response.status);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (guidIsValid) {
            fetchData();
        } else {
            setData(null);
        }
    }, [guidIsValid]);

    useEffect(() => {
        if (responceId !== 0) {
            fetchMetroData();
        }
    }, [responceId]);

    if (responceId === 0) {
        return (
            <>
                <p>GUID не найден</p>
            </>
        );
    }

    if (loading) {
        return (
            <>
                <p>Загружаем информацию...</p>
            </>
        );
    }

    if (!guidIsValid) {
        return (
            <>
                <p>Неправильный GUID, попробуйте снова</p>
            </>
        );
    }

    return (
        <>
            <div className="equip__card">
                <div className="equip__card-header">
                    <h1>{data?.catalogOfEquipmentItem.title}</h1>
                    <p className="equip__guid">{data?.catalogOfEquipmentItem.kindOfEquipmentTitle}</p>
                    <div className="tabs">
                        <div className="tab-item active">Описание</div>
                    </div>
                    <div className="equip__devider"></div>
                </div>
                <div className="equip__body">
                    <>
                        <div className="equip__photo">
                            {loading ? (
                                <Skeleton />
                            ) : (
                                <>
                                    {!imageLoaded && <Skeleton />}
                                    <img
                                        src={`data:image/jpeg;base64,${data?.catalogOfEquipmentItem.equipmentPhoto}`}
                                        alt="equipment photo"
                                        className={`equip__image ${!imageLoaded ? "hidden" : ""}`}
                                        onLoad={handleImageLoad}
                                    />
                                </>
                            )}
                        </div>
                        <div className="equip__descr">
                            <p className="equip__descr-row">
                                <span>Заводской номер:</span>
                                {data?.serialNum || "не указан"}
                            </p>
                            <p className="equip__descr-row">
                                <span>Инвентарный номер:</span>
                                {data?.inventarNum || "не указан"}
                            </p>
                            <p className="equip__descr-row">
                                <span>Местонахождение:</span>
                                {data?.placeItem.placeTitle || "не указано"}
                            </p>
                            <p className="equip__descr-row">
                                <span>Статус:</span>
                                {data?.statusTitle}
                            </p>
                        </div>
                        <h2 className="tab-item active">Метрологическая оценка</h2>
                        <Certificates metroData={metroData} />
                    </>
                </div>
            </div>
        </>
    );
}

export default App;
