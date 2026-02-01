import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

// Middleware de Proxy Seguro para APIs de Terceiros
export const proxyMiddleware = async (req, res, next) => {
    // Apenas rotas /api/crm/* são interceptadas aqui se desejar
    // Por simplicidade, este é um exemplo de função handler para rotas específicas
    next();
};

export const handleHubSpotProxy = async (req, res) => {
    try {
        const hubspotToken = process.env.VITE_HUBSPOT_TOKEN;
        if (!hubspotToken) {
            return res.status(500).json({ error: "Server misconfigured: Missing HubSpot Token" });
        }

        const response = await axios.post(
            "https://api.hubapi.com/crm/v3/objects/contacts",
            req.body,
            {
                headers: {
                    Authorization: `Bearer ${hubspotToken}`,
                    "Content-Type": "application/json"
                },
                timeout: 5000 // 5s timeout
            }
        );

        // Cache opcional poderia ser implementado aqui para GETs

        res.json({ success: true, crmId: response.data.id, message: "Synced via Proxy" });

    } catch (error) {
        // Mascarar erro real do cliente, logar no server
        console.error("HubSpot Proxy Error:", error.message);

        if (error.response?.status === 409) {
            return res.status(409).json({ error: "Contact already exists" });
        }

        res.status(502).json({ error: "Upstream CRM Error" });
    }
};
