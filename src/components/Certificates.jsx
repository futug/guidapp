import React, { useState } from "react";
import "../App.css";

const Certificates = ({ metroData }) => {
    const [shownMetroData, setShownMetroData] = useState(5);
    const [sliceStart, setSliceStart] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    console.log(currentPage);

    const sliceInc = () => {
        setSliceStart(sliceStart + 5);
    };

    const showMore = () => {
        if (shownMetroData < metroData.length) {
            setShownMetroData(shownMetroData + 5);
            sliceInc();
            console.log(sliceStart);
            setCurrentPage(currentPage + 1);
        } else {
            setShownMetroData(5);
            setSliceStart(0);
        }
    };
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

    const generatePageButtons = () => {
        const totalPages = Math.ceil((metroData?.length || 0) / itemsPerPage);
        const pageButtons = [];

        for (let i = 1; i <= totalPages; i++) {
            pageButtons.push(
                <button
                    key={i}
                    onClick={() => {
                        setCurrentPage(i);
                        setSliceStart((i - 1) * itemsPerPage);
                        setShownMetroData(i * itemsPerPage);
                    }}
                    className={i === currentPage ? "pagination__active" : "pagination"}
                >
                    {i}
                </button>
            );
        }

        return pageButtons;
    };

    console.log(sliceStart);

    return (
        <div className="equip__certificates">
            {metroData?.slice(sliceStart, shownMetroData).map((metro) => (
                <div key={metro.id}>
                    <p className="certificate__row">
                        <span className="certificate__title">Документ:</span>
                        {metro.metrologicDocumentTitle}
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Номер документа:</span>
                        {metro.metrologicDocumentNum}
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Срок действия:</span>
                        {metro.metrologicDate && metro.nextMetrologicDate ? (
                            <span>
                                с {formatDate(metro.metrologicDate)} по {formatDate(metro.nextMetrologicDate)}
                            </span>
                        ) : metro.metrologicDate ? (
                            <span>с {formatDate(metro.metrologicDate)}</span>
                        ) : metro.nextMetrologicDate ? (
                            <span>по {formatDate(metro.nextMetrologicDate)}</span>
                        ) : null}
                        {isExpired(metro.nextMetrologicDate) && (
                            <span>
                                {" "}
                                <span className="certificate__expired">Срок истек</span>
                            </span>
                        )}
                    </p>
                    <p className="certificate__row">
                        <span className="certificate__title">Исполнитель:</span>
                        {metro.metrologicOrganisationTitle ? metro.metrologicOrganisationTitle : "Не указан"}
                    </p>
                    <hr />
                </div>
            ))}
            <div className="cerificate__footer">
                <button className="equip__certificates-more" disabled={shownMetroData >= metroData.length} onClick={showMore}>
                    Показать еще
                </button>
                <div className="pagination">{generatePageButtons()}</div>
            </div>
        </div>
    );
};

export default Certificates;
