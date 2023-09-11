import { useState, useEffect } from "react";
import "./App.css";
import { useLocation } from "react-router-dom";

function App() {
    const location = useLocation();
    const guid = new URLSearchParams(location.search).get("guid");
    const [data, setData] = useState(null);
    const [metroData, setMetroData] = useState(null);
    const [chosenTab, setChosenTab] = useState("Описание");

    // Функция для валидации GUID
    const validateGUID = (guid) => {
        const guidPattern = /^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}$/;
        return guidPattern.test(guid);
    };
    const [guidIsValid, setGuidIsValid] = useState(validateGUID(guid));
    const fetchData = async () => {
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
        }
    };

    const fetchMetroData = async () => {
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
        }
    };

    useEffect(() => {
        if (guidIsValid) {
            fetchData();
            fetchMetroData();
        } else {
            setData(null);
        }
    }, [guidIsValid]);

    function formatDate(date) {
        if (date) {
            const options = { year: "numeric", month: "2-digit", day: "2-digit" };
            const formattedDate = new Date(date).toLocaleDateString("ru-RU", options);
            return formattedDate;
        }
        return "";
    }

    function isExpired(date) {
        if (date) {
            return new Date(date) < new Date();
        }
        return false;
    }

    console.log(chosenTab);

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
                    <p className="equip__guid">
                        <span>GUID:&nbsp;</span>
                        {guid}
                    </p>
                    <div className="tabs">
                        <div onClick={() => setChosenTab("Описание")} className={`tab-item ${chosenTab === "Описание" ? "active" : ""}`}>
                            Описание
                        </div>
                        <div onClick={() => setChosenTab("Сертификаты")} className={`tab-item ${chosenTab === "Сертификаты" ? "active" : ""}`}>
                            Сертификаты
                        </div>
                    </div>
                    <div className="equip__devider"></div>
                </div>
                <div className="equip__body">
                    {chosenTab === "Описание" ? (
                        <>
                            <div className="equip__photo">
                                <img
                                    src={`data:image/jpeg;base64,${data?.catalogOfEquipmentItem.equipmentPhoto}`}
                                    alt="equipment photo"
                                    className="equip__image"
                                />
                            </div>
                            <div className="equip__descr">
                                <p className="equip__descr-row">
                                    <span>Вид оборудования:</span>
                                    {data?.catalogOfEquipmentItem.kindOfEquipmentTitle}
                                </p>
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
                        </>
                    ) : (
                        <div className="equip__certificates">
                            {metroData?.map((metro) => (
                                <div key={metro.id}>
                                    <p>{metro.metrologicDocumentTitle}</p>
                                    <p>{metro.metrologicDocumentNum}</p>
                                    <p>
                                        {metro.metrologicDate && metro.nextMetrologicDate ? (
                                            <span>
                                                с {formatDate(metro.metrologicDate)} по {formatDate(metro.nextMetrologicDate)}
                                            </span>
                                        ) : metro.metrologicDate ? (
                                            <span>с {formatDate(metro.metrologicDate)}</span>
                                        ) : metro.nextMetrologicDate ? (
                                            <span>по {formatDate(metro.nextMetrologicDate)}</span>
                                        ) : null}
                                        {isExpired(metro.nextMetrologicDate) && <span> - Срок истек</span>}
                                    </p>
                                    <p>{metro.metrologicOrganisationTitle}</p>
                                    <hr />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default App;
