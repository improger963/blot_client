// src/components/DepositFlow.tsx

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, type SubmitHandler } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { createDepositRequest } from '../services/dataService';
import type { CreateDepositPayload, DepositConfigResponse } from '../types/api';
import { Button, Input, Skeleton } from './ui';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { showError, showSuccess } from '../lib/notifications';
import { motion, AnimatePresence } from 'framer-motion';
import { CopyIcon, CheckIcon, ArrowLeftIcon, WalletIcon, QrCodeIcon } from './icons';
import { GlassCard } from './ui/GlassCard';

// --- Компонент Шага 1: Выбор способа оплаты ---
const Step1Form = ({ config, onSubmit, isLoading, errors }: { config: DepositConfigResponse, onSubmit: SubmitHandler<CreateDepositPayload>, isLoading: boolean, errors: any }) => {
  const { register, handleSubmit, watch, setValue, formState: { errors: formErrors } } = useForm<CreateDepositPayload>({
    defaultValues: {
      amount: 100
    }
  });
  
  const amount = watch('amount');
  
  // Preset amounts for quick selection
  const presetAmounts = [50, 100, 250, 500, 1000];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <WalletIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">Deposit Funds</h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Select amount and payment method
        </p>
      </div>

      {/* Блок выбора суммы */}
      <div className="space-y-4">
        <h4 className="text-xs sm:text-sm font-medium text-white">💰 Deposit Amount</h4>
        
        {/* Пресеты сумм */}
        <div className="grid grid-cols-5 gap-2">
          {presetAmounts.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => {
                setValue('amount', preset);
              }}
              className={`py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                amount === preset
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                  : 'glass-card text-white hover:bg-white/10'
              }`}
            >
              ${preset}
            </button>
          ))}
        </div>
        
        {/* Ручной ввод суммы */}
        <Input
          id="amount"
          type="number"
          step="0.01"
          variant="filled"
          error={formErrors.amount?.message || errors?.amount?.[0]}
          placeholder={`From ${config.min_amount} to ${config.max_amount} USD`}
          {...register('amount', {
            required: 'Amount is required',
            valueAsNumber: true,
            min: { value: config.min_amount, message: `Minimum amount: ${config.min_amount}` },
            max: { value: config.max_amount, message: `Maximum amount: ${config.max_amount}` },
          })}
        />
        {(formErrors.amount || errors?.amount) && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 flex items-center gap-1"
          >
            ⚠️ {formErrors.amount?.message || errors?.amount?.[0]}
          </motion.p>
        )}
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-primary"></div>
            <span className="text-[0.65rem] sm:text-xs mt-1 text-primary font-medium">1</span>
          </div>
          <div className="w-12 sm:w-16 h-0.5 bg-primary"></div>
          <div className="flex flex-col items-center">
            <div className="w-2 sm:w-3 h-2 sm:h-3 rounded-full bg-border/40"></div>
            <span className="text-[0.65rem] sm:text-xs mt-1 text-gray-400">2</span>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="secondary" className="h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold">
          Back
        </Button>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg glass-button text-white hover:translate-y-[-2px]"
            isLoading={isLoading}
          >
            {isLoading ? 'Processing...' : 'Continue'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Компонент Шага 2: Отправка ---
const Step2Instructions = ({ address, amount, onBack }: { address: string, amount: number, onBack: () => void }) => {
  const { isCopied, copiedText, copy } = useCopyToClipboard();

  const handleCopyAddress = () => {
    copy(address);
  };

  const handleCopyAmount = () => {
    copy(amount.toString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Заголовок шага */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10"
            whileHover={{ 
              scale: 1.1,
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 0.5 }}
          >
            <QrCodeIcon className="h-6 w-6 text-primary" />
          </motion.div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-white">Send Payment</h3>
        <p className="text-xs sm:text-sm text-gray-400">
          Send the exact amount to the address below
        </p>
      </div>

      {/* Блок шагов */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-border/40"></div>
            <span className="text-xs mt-1 text-gray-400">1</span>
          </div>
          <div className="w-16 h-0.5 bg-border/40"></div>
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full bg-primary"></div>
            <span className="text-xs mt-1 text-primary font-medium">2</span>
          </div>
        </div>
      </div>

      {/* Блок суммы */}
      <GlassCard className="rounded-xl p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[0.65rem] sm:text-xs text-gray-400">Amount</p>
            <p className="text-base sm:text-lg font-bold text-white">${amount.toFixed(2)}</p>
          </div>
          <Button 
            onClick={handleCopyAmount}
            className="h-8 rounded-lg px-3 text-xs font-medium glass-card text-gray-200 hover:bg-white/10"
          >
            {isCopied && copiedText === amount.toString() ? '✓ Copied' : '📋 Copy'}
          </Button>
        </div>
        <div className="mt-3 p-3 rounded-lg bg-yellow-500/10">
          <p className="text-[0.65rem] sm:text-xs text-yellow-500 flex items-center gap-1">
            ⚠️ Send the exact amount, otherwise the transaction will not be credited
          </p>
        </div>
      </GlassCard>

      {/* Адрес и QR-код */}
      <div className="space-y-4">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-white p-3 sm:p-4 shadow-lg">
            <QRCode value={address} size={120} className="w-32 h-32 sm:w-40 sm:h-40" />
          </div>
        </div>
        
        <div className="space-y-3">
          <p className="text-xs sm:text-sm font-medium text-white text-center">Wallet Address</p>
          <div className="relative">
            <div className="break-words rounded-lg sm:rounded-xl bg-card/50 p-3 sm:p-4 font-mono text-xs sm:text-sm text-white pr-10 sm:pr-12">
              {address}
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyAddress}
              className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {isCopied && copiedText === address ? <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4" /> : <CopyIcon className="h-3 w-3 sm:h-4 sm:w-4" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Кнопки */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="secondary"
            onClick={onBack}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Back
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
          <Button
            onClick={handleCopyAddress}
            className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold shadow-lg glass-button text-white hover:translate-y-[-2px]"
          >
            {isCopied && copiedText === address ? '✓ Copied' : '📋 Copy Address'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// --- Основной компонент ---
export const DepositFlow = ({ onSuccess, config, isLoadingConfig }: { onSuccess?: () => void, config: DepositConfigResponse | undefined, isLoadingConfig: boolean }) => {
    const [step, setStep] = useState(1);
    const [depositDetails, setDepositDetails] = useState<{ deposit_address: string; amount: number } | null>(null);
    const [errors, setErrors] = useState<any>(null);
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: CreateDepositPayload) => createDepositRequest(payload),
        onSuccess: (data) => {
            setErrors(null);
            showSuccess(data.message || 'Deposit address generated!');
            setDepositDetails(data);
            setStep(2);
            queryClient.invalidateQueries({ queryKey: ['walletHistory'] });
            queryClient.invalidateQueries({ queryKey: ['user'] });
            if (onSuccess) {
                onSuccess();
            }
        },
        onError: (error: any) => {
            // Handle validation errors (422)
            if (error?.response?.status === 422) {
                const validationErrors = error.response.data.errors;
                setErrors(validationErrors);
            } else {
                setErrors(null);
                showError(error?.response?.data?.message || error.message || 'Failed to generate deposit address');
            }
        },
    });

    const handleFormSubmit: SubmitHandler<CreateDepositPayload> = (data) => {
        setErrors(null);
        mutate(data);
    };

    const handleBack = () => {
        setStep(1);
        setDepositDetails(null);
        setErrors(null);
    };

    if (isLoadingConfig) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-12 w-32 mx-auto bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-16 bg-card/60 rounded-xl" />
                <Skeleton className="h-12 bg-card/60 rounded-xl" />
            </div>
        );
    }

    if (!config) {
        return (
            <div className="text-center space-y-4 py-8">
                <div className="text-red-400 text-4xl">⚠️</div>
                <h3 className="text-lg font-semibold text-white">Loading Error</h3>
                <p className="text-sm text-gray-400">Failed to load payment methods</p>
                <Button onClick={() => window.location.reload()} variant="secondary">
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <Step1Form
                        key="step1"
                        config={config}
                        onSubmit={handleFormSubmit}
                        isLoading={isPending}
                        errors={errors}
                    />
                )}
                {step === 2 && depositDetails && (
                    <Step2Instructions
                        key="step2"
                        address={depositDetails.deposit_address}
                        amount={depositDetails.amount}
                        onBack={handleBack}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};