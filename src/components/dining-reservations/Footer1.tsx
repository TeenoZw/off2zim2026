import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";

export const Footer1: React.FC = () => {
  return (
    <footer className="px-[5%] py-16 bg-gray-900 text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="text-2xl font-bold mb-4">Off2Zim</div>
            <p className="text-gray-300 text-sm">
              Your gateway to authentic Zimbabwean dining experiences.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Restaurants
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Reservations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Cuisine Types</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white">
                  Traditional
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Modern Fusion
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  International
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Vegetarian
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p className="inline-flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-400" />
                +263 4 123 4567
              </p>
              <p className="inline-flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-400" />
                dining@off2zim.com
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-400" />
                Harare, Zimbabwe
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Off2Zim. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
