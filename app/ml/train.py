from app.ml.model_service import train_house_model, train_land_model


def main():
    house = train_house_model()
    land = train_land_model()
    print(
        {
            "house_model": {"r2": round(house["r2"], 4), "mae": round(house["mae"], 2)},
            "land_model": {"r2": round(land["r2"], 4), "mae": round(land["mae"], 2)},
        }
    )


if __name__ == "__main__":
    main()
