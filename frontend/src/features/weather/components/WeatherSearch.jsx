import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Search } from "lucide-react";
import { useState } from "react";

function WeatherSearch({onSearch , loading}) {
  const[city, setCity] = useState("");

  //Handler Function
  const handleSubmit = (event) =>{
    event.preventDefault();
  
    //prevent empty input or just spaces
    const trimmedCity = city.trim();
    if(!trimmedCity){
      return;
    }
    onSearch(trimmedCity);
    console.log("City Searched", trimmedCity);
  }

  return (
    <form 
    onSubmit={handleSubmit}
    className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-3 sm:flex-row"
    >
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

        <Input
          type="text"
          placeholder="Search for a city..."
          className="h-12 rounded-xl border-slate-200 bg-white pl-11 text-base shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-sky-500"
          value ={city}
          onChange ={(event)=>setCity(event.target.value)}
        />
      </div>

      <Button
        type="submit"
        disabled = {loading}
        className="h-12 w-full rounded-xl bg-sky-600 px-8 font-semibold shadow-sm transition-all hover:bg-sky-700 hover:shadow-md sm:w-auto"
      >
        <Search className="mr-2 h-4 w-4" />
       {loading ? "Searching...": "Search"}
      </Button>
    </form>
  );
}

export default WeatherSearch;